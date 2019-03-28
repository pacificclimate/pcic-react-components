import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import memoize from 'memoize-one';
import {
  flow, takeWhile, slice, map, reduce, filter, tap,
  sortBy, get,
} from 'lodash/fp';
import { objUnion } from '../../../../../src/lib/utils/fp';
import _ from 'lodash';

import meta from '../../assets/meta'
import './DemoMEV.css';
import VariableSelector from '../../../../lib/components/select/VariableSelector';
import ModelSelector from '../../../../lib/components/select/ModelSelector';
import EmissionsScenarioSelector from '../../../../lib/components/select/EmissionsScenarioSelector';
import DatasetSelector from '../../../../lib/components/select/DataspecSelector';


function stringify(obj) {
  return <pre>{JSON.stringify(obj, null, 2)}</pre>;
}


class DemoMEV extends Component {
  state = {
    mev: {
      model: undefined,
      emissions: undefined,
      variable: undefined,
    },
    // selectorOrder: 'model emissions variable'.split(' '),
    selectorOrder: 'model emissions variable'.split(' '),
    dataset: {
      // "start_date": "1961",
      // "end_date": "1990",
      // "ensemble_member": "r1i1p1"
    },
  };

  handleChangeSelection = (collection, item, value) =>
    this.setState(prevState => ({
      [collection]: { ...prevState[collection], [item]: value }
    }));

  anyHandleChangeModel = (option) =>
    this.setState(prevState => ({
      mev: { ...prevState.mev, model: option }
    }));
  anyHandleChangeEmissions = (option) =>
    this.setState(prevState => ({
      mev: { ...prevState.mev, emissions: option }
    }));
  anyHandleChangeVariable = (option) =>
    this.setState(prevState => ({
      mev: { ...prevState.mev, variable: option }
    }));

  anySelectorConstraint =
    (thisSelector, selectorOrder, state) => flow(
      tap(() => console.log(`anySelectorConstraint: thisSelector`, thisSelector, `selectorOrder`, selectorOrder, 'state', state)),
      takeWhile(selector => selector !== thisSelector),
      map(selector => state[selector] && state[selector].representative),
      objUnion,
      tap(result => console.log(`anySelectorConstraint: result`, result))
    )(selectorOrder)
  ;

  handleChangeDataset = dataset => this.setState({ dataset });

  static colProps = {
    lg: 3, md: 3, sm: 3,
  };

  anySelector = sel => {
    const Selector = {
      'model': ModelSelector,
      'emissions': EmissionsScenarioSelector,
      'variable': VariableSelector,
    }[sel];

    const selProps = {
      'model': {
        onChange: this.anyHandleChangeModel,
      },
      'emissions': {
        onChange: this.anyHandleChangeEmissions,
      },
      'variable': {
        onChange: this.anyHandleChangeVariable,
      },
    }[sel];

    const constraint = this.anySelectorConstraint(sel, this.state.selectorOrder, this.state.mev);

    return (
      <Col {...DemoMEV.colProps}>
        <Selector
          bases={meta}
          constraint={constraint}
          value={this.state.mev[sel]}
          {...selProps}
        />
        Input constraint: {stringify(constraint)}
        Value: {stringify(this.state.mev[sel] && this.state.mev[sel].representative)}
      </Col>
    );
  };

  moveSelectorOrderDown = index => this.setState(prevState => {
    const prevOrder = prevState.selectorOrder;
    return {
      selectorOrder: _.concat(
        slice(0, index, prevOrder),
        prevOrder[index+1],
        prevOrder[index],
        slice(index+2, undefined, prevOrder),
      )};
  });

  render() {
    console.log('DemoMEV.render')
    const mevConstraint = objUnion(this.state.mev);
    console.log('DemoMEV.render: mevConstraint', mevConstraint)
    const mevFilteredMetadata = filter(mevConstraint)(meta);
    console.log('DemoMEV.render: mevFilteredMetadata', mevFilteredMetadata)
    const mevdFilteredMetadata = filter(this.state.dataset)(mevFilteredMetadata);

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <p>{`
              The Model, Emissions, and Scenario selectors below are
              "cascaded": For any given selector, the selections
              in all preceding selectors determines which options are
              enabled. An option is enabled if there is at least one
              metadata item that it would select in combination with
              the preceding selections.
            `}</p>
            <p>{`
              The order of theModel, Emissions, and Variable selectors
              can be changed dynamically (with consequent changed to the
              cascading. Click an arrow beside any selector label to
              change its position in the cascade (and in the UI).
            `}</p>
          </Col>
        </Row>
        <Row>
            {
              this.state.selectorOrder.map((sel, index) => (
                <Col {...DemoMEV.colProps} className='text-center'>
                  <h2>
                    {
                      index > 0 &&
                      <Button
                        bsSize={'xsmall'}
                        onClick={this.moveSelectorOrderDown.bind(this, index-1)}
                      >
                        <Glyphicon glyph={'arrow-left'}/>
                      </Button>
                    }
                    {` ${sel} `}
                    {
                      index < 2 &&
                      <Button
                        bsSize={'xsmall'}
                        onClick={this.moveSelectorOrderDown.bind(this, index)}
                      >
                        <Glyphicon glyph={'arrow-right'}/>
                      </Button>
                    }
                  </h2>
                </Col>
              ))
            }
            <Col {...DemoMEV.colProps}><h2>Filtered metadata</h2></Col>
        </Row>

        <Row>
          {map(sel => this.anySelector(sel))(this.state.selectorOrder)}
          <Col {...DemoMEV.colProps}>
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
            <p>{`
              The Dataspec selector shows only options that are valid (i.e.,
              actually select something) in combination with the Model,
              Emissions, and Variable selections above.
            `}</p>
          </Col>
        </Row>

        <Row>
          <Col {...DemoMEV.colProps}>
            <DatasetSelector
              bases={mevFilteredMetadata}
              value={this.state.dataset}
              onChange={this.handleChangeDataset}
            />
            {stringify(this.state.dataset.representative)}
          </Col>
          <Col {...DemoMEV.colProps} lgOffset={6} mdOffset={6} smOffset={6}>
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
}

export default DemoMEV;
