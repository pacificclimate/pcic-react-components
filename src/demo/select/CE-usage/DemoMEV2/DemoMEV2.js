import React, { useState } from 'react';
import { Button, Col, Glyphicon, Grid, Row } from 'react-bootstrap';
import { filter, flow, map, sortBy } from 'lodash/fp';
import { objUnion } from '../../../../../src/lib/utils/fp';
import DatasetSelector
  from '../../../../lib/components/select/DataspecSelector';
import ModelSelector from '../../../../lib/components/select2/ModelSelector';
import EmissionsScenarioSelector
  from '../../../../lib/components/select2/EmissionsScenarioSelector';
import VariableSelector
  from '../../../../lib/components/select2/VariableSelector';
import { useCascadingSelectorState }
  from "../../../../lib/components/select2/hooks"

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
  Selector,
  // Specific selector to be rendered in column

  name,
  // For debugging, optional.

  constraint,
  value,
  ...rest
  // Props to be passed through to rendered selector.
}) {
  return (
    <Col {...colProps}>
      <h2>Input constraint</h2>
      <div style={{height: '10em'}}>
        {stringify(constraint)}
      </div>
      <h2>Selector</h2>
      <Selector
        metadata={meta}
        constraint={constraint}
        value={value}
        {...rest}
      />
      <h2>Value</h2>
      <p>
        {stringify(value && value.value && value.value.representative)}
      </p>
    </Col>
  );
}


// Component that demonstrates usage of all select2 selectors and associated
// utility functions and hooks.
function DemoMEV2() {
  // Construct states and handlers for model, emissions and controller
  // selectors. Let the awesomeness begin.
  const {
    order: selectorOrder,
    moveOrderItemDown: moveSelectorOrderDown,
    value,
    // isSettled,
    handleChangeValue,
    handleNoChangeValue,
    selectorConstraint,
    selectorCanReplace,
  } = useCascadingSelectorState(["model", "emissions", "variable"]);

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
      {/*<Row>*/}
      {/*  <Col>*/}
      {/*    {stringify(isSettled)}*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/* Row of labels and buttons for changing cascade order */}
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
        {/* Plus an extra column for the metadata filtered by the resulting
        selections */}
        <Col {...colProps}><h2>Metadata filtered by selections</h2></Col>
      </Row>

      {/* Row of selectors (in cascade order), with associated labels etc. */}
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
        {/* Plus an extra column for the metadata filtered by the resulting
         selections */}
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

      {/* Dataset selector. It has not yet been rebuilt with the new utils. */}
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
