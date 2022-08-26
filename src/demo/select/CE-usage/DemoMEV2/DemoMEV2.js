import React, { Component, useState } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { useImmer } from 'use-immer';
import memoize from 'memoize-one';
import {
  flow, takeWhile, slice, map, reduce, filter, tap,
  sortBy, get,
} from 'lodash/fp';
import { objUnion } from '../../../../../src/lib/utils/fp';
import _ from 'lodash';

import meta from '../../assets/meta'
import './DemoMEV2.css';
// import { ModelSelector, EmissionsScenarioSelector, VariableSelector }
//   from '../../../../lib/components/select2/cascading-logic';
import DatasetSelector from '../../../../lib/components/select/DataspecSelector';
import ModelSelector from '../../../../lib/components/select2/ModelSelector';
import EmissionsScenarioSelector
  from '../../../../lib/components/select2/EmissionsScenarioSelector';
import VariableSelector
  from '../../../../lib/components/select2/VariableSelector';


function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}

const colProps = {
  lg: 3, md: 3, sm: 3,
};

const selectorConstraint =
  (thisSelector, selectorOrder, state) => flow(
    tap(() => console.log(`anySelectorConstraint: thisSelector`, thisSelector, `selectorOrder`, selectorOrder, 'state', state)),
    takeWhile(selector => selector !== thisSelector),
    map(selector => state[selector] && state[selector].option && state[selector].option.value.representative),
    objUnion,
    tap(result => console.log(`anySelectorConstraint: result`, result))
  )(selectorOrder)
;

const selectorCanReplace = (sel, selectorOrder, mev) => {
  // TODO: Generalize
  switch (sel) {
    case "model": return true;
    case "emissions": return mev.model.isSettled;
    case "variable": return mev.model.isSettled && mev.emissions.isSettled;
  }
}

// const Selectors = {
//   model: (props) => (
//     <ModelSelector value={mev.model} onChange={setModel} {...props}/>
//   ),
//   emissions: (props) => (
//     <EmissionsScenarioSelector value={mev.emissions} onChange={setEmissions} {...props}/>
//   ),
//   variable: (props) => (
//     <VariableSelector value={mev.variable} onChange={setVariable} {...props}/>
//   ),
// };

const Selectors = {
  'model': ModelSelector,
  'emissions': EmissionsScenarioSelector,
  'variable': VariableSelector,
};

function SelectorColumn({ sel, selectorOrder, mev, onChange }) {
  console.group(`SelectorColumn (${sel})`)
  const Selector = Selectors[sel];
  const constraint = selectorConstraint(sel, selectorOrder, mev);
  const canReplace = selectorCanReplace(sel, selectorOrder, mev);
  console.log("constraint", constraint)
  console.log("canReplace", canReplace)
  console.groupEnd()

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
        value={mev[sel].option}
        onChange={onChange[sel]}
        canReplace={canReplace}
      />
      <h2>Value</h2>
      <p>
        {stringify(mev[sel] && mev[sel].option && mev[sel].option.value.representative)}
      </p>
    </Col>
  );
}

function DemoMEV2() {
  const [mev, setMev] = useImmer({
    model: { option: undefined, isSettled: false },
    emissions: { option: undefined, isSettled: false },
    variable: { option: undefined, isSettled: false },
  });
  // TODO: Generalize
  const onChangeMev = {
    model: option => setMev(draft => {
      draft.model.option = option;
      draft.model.isSettled = true;
      draft.emissions.isSettled = false;
      draft.variable.isSettled = false;
    }),
    emissions: option => setMev(draft => {
      draft.emissions.option = option;
      draft.emissions.isSettled = true;
      draft.variable.isSettled = false;
    }),
    variable: option => setMev(draft => {
      draft.variable.option = option;
      draft.variable.isSettled = true;
    }),
  };

  const [selectorOrder, setSelectorOrder] = useState(
    'model emissions variable'.split(' ')
  );
  const moveSelectorOrderDown = index => () =>
    setSelectorOrder(prevOrder => {
      return _.concat(
        slice(0, index, prevOrder),
        prevOrder[index + 1],
        prevOrder[index],
        slice(index + 2, undefined, prevOrder),
      );
    });

  const [dataset, setDataset] = useState({ value: {} });

  console.log('DemoMEV.render')
  const mevConstraint = objUnion(
    map(mev => mev && mev.option && mev.option.value.representative)(mev)
  );
  console.log('DemoMEV.render: mevConstraint', mevConstraint)
  const mevFilteredMetadata = filter(mevConstraint)(meta);
  console.log('DemoMEV.render: mevFilteredMetadata', mevFilteredMetadata)
  const mevdFilteredMetadata = filter(dataset && dataset.value.representative)(mevFilteredMetadata);

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
          {stringify({
            model: mev.model.isSettled,
            emissions: mev.emissions.isSettled,
            variable: mev.variable.isSettled,
          })}
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
        {map(sel => (
          <SelectorColumn
            sel={sel}
            selectorOrder={selectorOrder}
            mev={mev}
            onChange={onChangeMev}
          />
        ), selectorOrder)}
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
