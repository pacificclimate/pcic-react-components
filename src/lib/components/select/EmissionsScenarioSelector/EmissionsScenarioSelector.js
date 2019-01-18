import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  flow, split, map, join,
} from 'lodash/fp';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './EmissionsScenarioSelector.css';


export default class EmissionsScenarioSelector extends Component {
  static propTypes = {
    bases: PropTypes.array.isRequired,
    // List of basis items the selector will build its options from.

    constraint: PropTypes.object,
    // Any option that does not have a context that matches this value
    // is disabled. Replaces prop getOptionIsDisabled' in `GroupingSelector`.

    debug: PropTypes.bool,
    debugValue: PropTypes.any,
    // For debugging, what else?

    // Only props key to this compoonent are declared here.
    // All props are passed through to rendered selector.
  };

  static defaultProps = {
    debugValue: 'Emissions'
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
      />
    );
  }
}
