import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { flow, filter, isMatch, pick, some, sortBy } from 'lodash/fp';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';

import './VariableSelector.css';

import { components } from 'react-select';

const { Option } = components;


export default class VariableSelector extends Component {
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
    debugValue: 'Variable'
  };

  static valueProps =
    'variable_id variable_name multi_year_mean'.split(' ');
  static getOptionValue = metadatum =>
    pick(VariableSelector.valueProps, metadatum);

  static getOptionLabel = ({ value: { variable_id, variable_name }}) =>
    `${variable_id} - ${variable_name}`;

  static arrangeOptions = options => {
    return [
      {
        label: 'Multi-Year Mean Datasets',
        options: flow(
          filter(o => o.value.multi_year_mean),
          sortBy('label'),
        )(options),
      },
      {
        label: 'Time Series Datasets',
        options: flow(
          filter(o => !o.value.multi_year_mean),
          sortBy('label'),
        )(options),
      },
    ];
  };

  static Option = props => {
    return (
      <Option {...props}>
        <Glyphicon glyph={props.value.multi_year_mean ? 'repeat' : 'star'}/>
        {' '}
        {props.label}
      </Option>
    )};

  render() {
    return (
      <SimpleConstraintGroupingSelector
        getOptionValue={VariableSelector.getOptionValue}
        getOptionLabel={VariableSelector.getOptionLabel}
        arrangeOptions={VariableSelector.arrangeOptions}
        components={{ Option: VariableSelector.Option }}
        {...this.props}
      />
    );
  }
}
