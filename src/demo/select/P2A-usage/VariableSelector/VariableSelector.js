import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { flow, filter, isMatch, pick, some, sortBy } from 'lodash/fp';

import SimpleConstraintGroupingSelector from '../../../../lib/components/select/SimpleConstraintGroupingSelector';

import './VariableSelector.css';


export default class VariableSelector extends Component {
  static propTypes = {
    constraint: PropTypes.object,
  };

  static valueProps =
    'variable_id variable_name'.split(' ');
  static getOptionRepresentative = metadatum =>
    pick(VariableSelector.valueProps, metadatum);

  static getOptionLabel = ({ representative: { variable_id, variable_name }}) =>
    `${variable_id} - ${variable_name}`;

  render() {
    return (
      <SimpleConstraintGroupingSelector
        {...this.props}
        getOptionRepresentative={VariableSelector.getOptionRepresentative}
        getOptionLabel={VariableSelector.getOptionLabel}
        debugValue='Variable'
      />
    );
  }
}
