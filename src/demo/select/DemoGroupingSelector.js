import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import GroupingSelector from '../../lib/components/select/GroupingSelector';
import ModelSelector from '../../lib/components/select/ModelSelector';
import meta from './assets/meta';

function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}

export default class DemoGroupingSelector extends Component {
  state = {
    value: null,
  };

  handleChangeSelectorValue = (value) =>
    this.setState({ value });

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col lg={3}>
            <GroupingSelector
              bases={meta}
              getOptionValue={ModelSelector.getOptionValue}
              value={this.state.value}
              onChange={this.handleChangeSelectorValue}
              debug={true}
            />
          </Col>
          <Col lg={3}>
            Value:
            {stringify(this.state.value && this.state.value.label)}
          </Col>
        </Row>
      </Grid>
    );
  }
}
