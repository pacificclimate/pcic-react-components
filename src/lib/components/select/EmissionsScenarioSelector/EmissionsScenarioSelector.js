import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  flow, split, map, join,
} from 'lodash/fp';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './EmissionsScenarioSelector.css';


export default class EmissionsScenarioSelector extends Component {
  static propTypes = {
    constraint: PropTypes.object,
  };

  static getOptionValue = metadatum => metadatum.experiment;

  static formattedPart = {
    historical: 'Historical',
    rcp26: 'RCP 2.6',
    rcp45: 'RCP 4.5',
    rcp85: 'RCP 8.5',
  };
  static formatPart = part => {
    try {
      return EmissionsScenarioSelector.formattedPart[part];
    } catch {
      return part;
    }
  };
  static getOptionLabel = option => (
    flow(
      split(/\s*,\s*/),
      map(EmissionsScenarioSelector.formatPart),
      join(', then '),
    )(option.value)
  );

  render() {
    return (
      <SimpleConstraintGroupingSelector
        getOptionValue={EmissionsScenarioSelector.getOptionValue}
        getOptionLabel={EmissionsScenarioSelector.getOptionLabel}
        {...this.props}
        debugValue='Emissions'
      />
    );
  }
}
