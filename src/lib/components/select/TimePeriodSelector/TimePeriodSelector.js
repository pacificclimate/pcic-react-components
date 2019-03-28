import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { flow, filter, isMatch, pick, some, sortBy } from 'lodash/fp';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';

import './TimePeriodSelector.css';


export default class TimePeriodSelector extends Component {
  static propTypes = {
    bases: PropTypes.array.isRequired,
    // List of basis items the selector will build its options from.

    constraint: PropTypes.object,
    // Any option that does not have a context that matches this value
    // is disabled. Replaces prop getOptionIsDisabled' in `GroupingSelector`.

    debug: PropTypes.bool,
    debugValue: PropTypes.any,
    // For debugging, what else?

    // Only props key to this component are declared here.
    // All props are passed through to rendered selector.
  };

  static defaultProps = {
    debugValue: 'TimePeriod'
  };

  static valueProps =
    'start_date end_date'.split(' ');
  static getOptionRepresentative = metadatum =>
    pick(TimePeriodSelector.valueProps, metadatum);

  static getOptionLabel = ({ representative: { start_date, end_date }}) =>
    `${start_date}-${end_date}`;

  render() {
    return (
      <SimpleConstraintGroupingSelector
        getOptionRepresentative={TimePeriodSelector.getOptionRepresentative}
        getOptionLabel={TimePeriodSelector.getOptionLabel}
        {...this.props}
      />
    );
  }
}
