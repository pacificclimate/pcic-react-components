import React, { Component } from 'react';
import { Grid, Row, Col, Checkbox } from 'react-bootstrap';

import TimeOfYearSelector from
    '../../../../lib/components/select/TimeOfYearSelector';


function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}


const setStateSimple = (this_, name) => value => this_.setState({ [name]: value });
const setStateCheckbox = (this_, name) => event => this_.setState({ [name]: event.target.checked });


class DemoMEV extends Component {
  state = {
    value: undefined,
    monthly: true,
    seasonal: true,
    yearly: true,
  };

  handleChangeTimeOfYear = setStateSimple(this, 'value');
  handleChangeMonthly = setStateCheckbox(this, 'monthly');
  handleChangeSeasonal = setStateCheckbox(this, 'seasonal');
  handleChangeYearly = setStateCheckbox(this, 'yearly');

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <p>{`
              Description
            `}</p>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={6} sm={6}>
            <Checkbox
              inline
              checked={this.state.monthly}
              onChange={this.handleChangeMonthly}>
              Monthly
            </Checkbox>
            <Checkbox
              inline
              checked={this.state.seasonal}
              onChange={this.handleChangeSeasonal}>
              Seasonal
            </Checkbox>
            <Checkbox
              inline
              checked={this.state.yearly}
              onChange={this.handleChangeYearly}>
              Yearly
            </Checkbox>
          </Col>
          <Col lg={3} md={6} sm={6}>
            <TimeOfYearSelector
              {...this.state}
              onChange={this.handleChangeTimeOfYear}
            />
          </Col>
          <Col lg={3} md={6} sm={6}>
            {stringify(this.state.value)}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DemoMEV;
