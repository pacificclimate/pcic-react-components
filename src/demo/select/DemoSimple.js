import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import Select from 'react-select';
import VariableSelector from '../../lib/components/select/VariableSelector';
import ModelSelector from '../../lib/components/select/ModelSelector';
import EmissionsScenarioSelector from '../../lib/components/select/EmissionsScenarioSelector';
import DataspecSelector from '../../lib/components/select/DataspecSelector';
import meta from './assets/meta';

function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}

const selectors = [
  { label: 'Model Selector', value: ModelSelector },
  { label: 'Emissions Scenario Selector', value: EmissionsScenarioSelector },
  { label: 'Variable Selector', value: VariableSelector },
  { label: 'Dataspec Selector', value: DataspecSelector },
];


export default class DemoSimple extends Component {
  state = {
    selector: selectors[0],
    selectorValue: undefined,
  };

  handleChangeSelector = selector => this.setState(
    { selector, selectorValue: undefined }
  );

  handleChangeSelectorValue = (selectorValue) =>
    this.setState({ selectorValue });

  render() {
    const Selector = this.state.selector.value;
    return (
      <Grid fluid>
        <Row>
          <Col lg={6}>
            This demo exercises each derived selector separately.
            No constraints are passed, but the selector initial values
            are undefined, to trigger invalid-value replacement.
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <h2>Selector to exercise</h2>
            <Select
              options={selectors}
              value={this.state.selector}
              onChange={this.handleChangeSelector}
            />
            {stringify(this.state.selector.label)}
          </Col>
          <Col lg={3}>
            <h2>Selector</h2>
            <Selector
              bases={meta}
              value={this.state.selectorValue}
              onChange={this.handleChangeSelectorValue}
              debug={true}
            />
            {stringify(this.state.selectorValue && this.state.selectorValue.value.representative)}
          </Col>
        </Row>
      </Grid>
    );
  }
}
