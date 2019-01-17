import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';

import './ModelSelector.css';


export default class ModelSelector extends Component {
  static propTypes = {
    constraint: PropTypes.object,
    debugValue: PropTypes.any,
  };

  static getOptionValue = metadatum => metadatum.model_id;

  render() {
    return (
      <SimpleConstraintGroupingSelector
        getOptionValue={ModelSelector.getOptionValue}
        {...this.props}
        debug={false}
        debugValue='Model'
      />
    );
  }
}
