import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import SimpleConstraintGroupingSelector from '../../lib/components/select/SimpleConstraintGroupingSelector';
import ModelSelector from '../../lib/components/select/ModelSelector';
import meta from './assets/meta';
import Select from 'react-select';
import VariableSelector from '../../lib/components/select/VariableSelector';
import EmissionsScenarioSelector from '../../lib/components/select/EmissionsScenarioSelector';
import DataspecSelector from '../../lib/components/select/DataspecSelector';

function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}

const selectors = [
  { label: 'Model Selector', value: ModelSelector },
  { label: 'Emissions Scenario Selector', value: EmissionsScenarioSelector },
  { label: 'Variable Selector', value: VariableSelector },
  { label: 'Dataspec Selector', value: DataspecSelector },
];


export default class DemoGroupingSelector extends Component {
  state = {
    selector: selectors[1],
    value: null,
  };

  handleChangeSelector = selector => this.setState(
    { selector, value: null }
  );

  handleChangeSelectorValue = (value) =>
    this.setState({ value });

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col lg={6}>
            This demo exercises SimpleConstraintGroupingSelector by passing it the
            exposed representative and label methods from a selected
            derived selector, and ... no constraints.
            This isn't trememdously robust to changes,
            but it is a convenient way of exercising the base selector.
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <h2>Derived selector providing methods</h2>
            <Select
              options={selectors}
              value={this.state.selector}
              onChange={this.handleChangeSelector}
            />
            {stringify(this.state.selector)}
          </Col>
          <Col lg={3}>
            <h2>SimpleConstraintGroupingSelector</h2>
            <SimpleConstraintGroupingSelector
              bases={meta}
              getOptionRepresentative={this.state.selector.value.getOptionRepresentative}
              getOptionLabel={this.state.selector.value.getOptionLabel}
              value={this.state.value}
              onChange={this.handleChangeSelectorValue}
              debug={true}
            />
            {stringify(this.state.value && this.state.value.label)}
          </Col>
        </Row>
      </Grid>
    );
  }
}
