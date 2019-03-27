import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';

import './ModelSelector.css';


export default class ModelSelector extends Component {
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
    debugValue: 'Model'
  };

  static getOptionRepresentative = metadatum => metadatum.model_id;

  render() {
    return (
      <SimpleConstraintGroupingSelector
        getOptionRepresentative={ModelSelector.getOptionRepresentative}
        {...this.props}
      />
    );
  }
}
