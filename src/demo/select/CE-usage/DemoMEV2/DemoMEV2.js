import React, { useState } from 'react';
import { Button, Col, Glyphicon, Grid, Row } from 'react-bootstrap';
import { useImmer } from 'use-immer';
import {
  filter, flow, map, sortBy, takeWhile, takeRightWhile, every,
  fromPairs,
} from 'lodash/fp';
import { objUnion } from '../../../../../src/lib/utils/fp';
import DatasetSelector
  from '../../../../lib/components/select/DataspecSelector';
import ModelSelector from '../../../../lib/components/select2/ModelSelector';
import EmissionsScenarioSelector
  from '../../../../lib/components/select2/EmissionsScenarioSelector';
import VariableSelector
  from '../../../../lib/components/select2/VariableSelector';

import meta from '../../assets/meta'
import './DemoMEV2.css';


function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}

const colProps = {
  lg: 3, md: 3, sm: 3,
};


const Selectors = {
  'model': ModelSelector,
  'emissions': EmissionsScenarioSelector,
  'variable': VariableSelector,
};


// Component that renders a React Bootstrap column containing a single
// selector plus associated labels and supplementary info.
function SelectorColumn({
  Selector, constraint, value, onChange, onNoChange, canReplace, name,
}) {
  return (
    <Col {...colProps}>
      <h2>Input constraint</h2>
      <div style={{height: '10em'}}>
        {stringify(constraint)}
      </div>
      <h2>Selector</h2>
      <Selector
        bases={meta}
        constraint={constraint}
        value={value}
        onChange={onChange}
        onNoChange={onNoChange}
        canReplace={canReplace}
      />
      <h2>Value</h2>
      <p>
        {stringify(value && value.value && value.value.representative)}
      </p>
    </Col>
  );
}


// This hook is where the (less mysterious, I hope) magic for
// cascading selectors happens. It accepts two arguments:
//
//  `initialOrder`: Required. An array containing the names of the
//    selector values in the order they should initially be cascaded
//    (e.g., `["model", "emissions", "variable"]`).
//
//  `initialState`: Optional, default `{}`. An object containing
//    initial values for the selector value states. Typically, each is
//    state is initially undefined, and the default value for this
//    argument provides that and need not be specified for this case.
//
// It returns three `useImmer` (see note below) state objects.
//
//  `option`: an immer state object with one prop per name in `initialOrder`,
//    with initial values given by `initialState`.
//
//  `isSettled`: an immer state object with one prop per name in `initialOrder`,
//    with initial values `false`.
//
//  `order`: an immer state object with initial value given by `initialOrder`.
//
// This hook also returns (`useImmer`) setters for each state object,
// plus several convenient state updaters (e.g., `onChange` handlers) that
// implement the cascading logic. See the comments to them below for details.
// The user could conceivably ignore these and roll their own from the states
// and setters returned.
//
// The key to successfully cascading state, as implemented here, is the notion
// of whether a selector's value has settled or is still being updated.
// Transient invalid states from upstream selectors can fool downstream
// selectors into making incorrect self-updates (from an apparently invalid
// state to a valid state). To prevent this effect, we introduce the `isSettled`
// flag for each cascaded selector. The handler hooks update the `isSettled`
// state so that downstream selectors do not self-update at inappropriate times.
// Prior to this implementation, PRS had a mysterious and subtle algorithm for
// handling this problem, which has now been replaced by this clearer one that
// is also exposed for the user to examine and potentially modify.
//
// **Note**: `immer` is a package that efficiently implements immutable objects
// with a remarkably developer-friendly interface. The value of immutable
// objects to developers is that they greatly simplify equality checking on
// structured objects: Immutable objects can be checked for value equality by
// checking reference equality only. No need for complicated expressions that
// compare object properties several levels deep; equality checks (reference
// comparisions) always remain correct when object structure changes. `immer`
// provides a particularly simple and convenient JS interface for creating and
// updating immutable objects. It was greeted with universal acclaim and a
// couple of awards upon its release and is in wide use.
// See https://immerjs.github.io/immer/ for more information.
//
// `use-immer` wraps `immer` as a React hook, and is what we use here.
// See https://immerjs.github.io/immer/example-setstate and
// https://www.npmjs.com/package/use-immer for more information.

const useCascadingSelectorState = (initialOrder, initialState = {}) => {
  const [value, setValue] = useImmer(
    flow(
      map(name => [name, initialState[name]]),
      fromPairs,
    )(initialOrder)
  );

  const [isSettled, setIsSettled] = useImmer(
    flow(
      map(name => [name, false]),
      fromPairs,
    )(initialOrder)
  );

  const [order, setOrder] = useImmer(initialOrder);

  // Make a handler to change a specified selector value. This change may
  // require downstream selectors to update their own values depending on how
  // the constraints cascaded down to them change (possibly making their current
  // value invalid). Hence: Set the selector state value for the specified
  // selector, declare that selector settled, and declare all downstream
  // selectors unsettled.
  const handleChangeValue = selectorId => option => {
    setValue(draft => {
      draft[selectorId] = option;
    });

    setIsSettled(draft => {
      draft[selectorId] = true;
      // Downstream selectors may need updating because constraints from an
      // upstream selector have changed.
      const downstreamIds = takeRightWhile(
        id => id !== selectorId, order
      );
      for (const id of downstreamIds) {
        draft[id] = false;
      }
    })
  }

  // Make a handler for the case that a selector can update its value to
  // valid one, but did not have to change its value because the current one
  // remains valid. Hence: Change the specified selector's `isSettled` state to
  // settled, and do nothing else.
  const handleNoChangeValue = selectorId => () => {
    setIsSettled(draft => {
      draft[selectorId] = true;
    });
  }

  // Make a handler to change the selector order by moving the ordering item
  // at `index` downstream one position (i.e., to the next higher index).
  const moveOrderItemDown = index => () => {
    setOrder(draft => {
      // Swap order[index] and order[index+1]
      draft[index] = order[index + 1];
      draft[index + 1] = order[index];
    });
  }

  // Compute the union of the upstream constraints for a given selector.
  // TODO: This is a PCIC react selectors specific computation, but the rest
  //  of this hook is agnostic to how its `value` state is used. Therefore this
  //  doesn't belong inside this hook, it belongs to the user, namely the Demo
  //  component.
  const selectorConstraint = (selectorId) =>
    flow(
      takeWhile(id => id !== selectorId),
      map(id => value[id] && value[id].value.representative),
      objUnion,
    )(order);

  // Compute a Boolean indicating whether a selector can replace its own value.
  // The condition is that all upstream selectors have settled.
  const selectorCanReplace = (selectorId) => flow(
    takeWhile(id => id !== selectorId),
    map(id => isSettled[id]),
    every(Boolean),
  )(order);

  return {
    order,
    setOrder,
    moveOrderItemDown,
    value,
    setValue,
    isSettled,
    setIsSettled,
    handleChangeValue,
    handleNoChangeValue,
    selectorConstraint,
    selectorCanReplace,
  };
}

function DemoMEV2() {
  const {
    order: selectorOrder,
    moveOrderItemDown: moveSelectorOrderDown,
    value,
    isSettled,
    handleChangeValue,
    handleNoChangeValue,
    selectorConstraint,
    selectorCanReplace,
  } = useCascadingSelectorState('model emissions variable'.split(' '));

  const [dataset, setDataset] = useState({ value: {} });

  console.log('DemoMEV2')
  const mevConstraint = objUnion(
    map(opt => opt && opt.value.representative)(value)
  );
  console.log('DemoMEV.render: mevConstraint', mevConstraint)
  const mevFilteredMetadata = filter(mevConstraint)(meta);
  console.log('DemoMEV.render: mevFilteredMetadata', mevFilteredMetadata)
  const mevdFilteredMetadata = filter(
    dataset && dataset.value.representative
  )(mevFilteredMetadata);

  return (
    <Grid fluid>
      <Row>
        <Col lg={6} md={12} sm={12}>
          <h1>Model, Emissions, Scenario selectors</h1>
          <p>{`
              The Model, Emissions, and Scenario selectors below are
              "cascaded": For any given selector, the selections
              in all selectors to the left determines which options are
              enabled. An option is enabled if there is at least one
              metadata item that it would select in combination with
              the upstream selections.
            `}</p>
          <p>{`
              The order of the Model, Emissions, and Variable selectors
              can be changed dynamically (with consequent changes to the
              cascading). Click an arrow beside any selector label to
              change its position in the cascade (and in the UI).
            `}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {stringify(isSettled)}
        </Col>
      </Row>
      <Row>
        {
          selectorOrder.map((sel, index) => (
            <Col {...colProps} className='text-center'>
              <h2>
                {
                  index > 0 &&
                  <Button
                    bsSize={'xsmall'}
                    onClick={moveSelectorOrderDown(index-1)}
                  >
                    <Glyphicon glyph={'arrow-left'}/>
                  </Button>
                }
                {` ${sel} `}
                {
                  index < 2 &&
                  <Button
                    bsSize={'xsmall'}
                    onClick={moveSelectorOrderDown(index)}
                  >
                    <Glyphicon glyph={'arrow-right'}/>
                  </Button>
                }
              </h2>
            </Col>
          ))
        }
        <Col {...colProps}><h2>Filtered metadata</h2></Col>
      </Row>

      <Row>
        {map(sel => {
          const constraint = selectorConstraint(sel);
          const canReplace = selectorCanReplace(sel);
          return(
            <SelectorColumn
              Selector={Selectors[sel]}
              constraint={constraint}
              value={value[sel]}
              onChange={handleChangeValue(sel)}
              onNoChange={handleNoChangeValue(sel)}
              canReplace={canReplace}
              name={sel}
            />
          )
        }, selectorOrder)}
        <Col {...colProps}>
          <ul>
            {
              flow(
                sortBy(['ensemble_member', 'start_date', 'timescale']),
                map(m => (
                  <li>
                    {`${m.ensemble_member} ${m.start_date}-${m.end_date} ${m.multi_year_mean ? 'MYM' : 'TS'} ${m.timescale}`}
                  </li>
                ))
              )(mevFilteredMetadata)
            }
          </ul>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <h1>Dataset selector</h1>
          <p>{`
              The Dataset selector shows only options that are valid (i.e.,
              actually select something) in combination with the Model,
              Emissions, and Variable selections above.
            `}</p>
        </Col>
      </Row>

      <Row>
        <Col {...colProps}>
          <h2>mevConstraint</h2>
          <div>
            {stringify(mevConstraint)}
          </div>
          {/*mevFilteredMetadata:*/}
          {/*<div style={{height: '10em'}}>*/}
          {/*{stringify(mevFilteredMetadata)}*/}
          {/*</div>*/}
          <h2>Dataset selector</h2>
          <DatasetSelector
            bases={mevFilteredMetadata}
            value={dataset}
            onChange={setDataset}
          />
          <h2>Value</h2>
          {stringify(dataset && dataset.value.representative)}
        </Col>
        <Col {...colProps} lgOffset={6} mdOffset={6} smOffset={6}>
          <ul>
            {
              flow(
                sortBy(['ensemble_member', 'start_date', 'timescale']),
                map(m => (
                  <li>
                    {`${m.ensemble_member} ${m.start_date}-${m.end_date} ${m.multi_year_mean ? 'MYM' : 'TS'} ${m.timescale}`}
                  </li>
                ))
              )(mevdFilteredMetadata)
            }
          </ul>
        </Col>
      </Row>
    </Grid>
  );
}

export default DemoMEV2;
