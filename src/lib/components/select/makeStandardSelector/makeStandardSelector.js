// This is a higher-order component that builds a specialized
// `SimpleConstraintGroupingSelector`.
//
// All provided specializations of `SimpleConstraintGroupingSelector` differ
// essentially only on the subset of properties of the basis metadata that
// forms the grouping representative, and the label that used for each group.
//
// This HOC abstracts that specialization. It:
//
//  - sets up propTypes
//  - creates and passes prop `getOptionRepresentative`
//  - passes through `additionalProps` as props
//  - passes through all props supplied to created component

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SimpleConstraintGroupingSelector
  from '../SimpleConstraintGroupingSelector';

import { pick } from 'lodash/fp';


export const makeStandardSelector = (
  {
    defaultDebugValue,
    representativeProps,
    selectorProps,
  }
) => {
  const getOptionRepresentative = metadatum =>
    pick(representativeProps, metadatum);

  return class extends Component {
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
      debugValue: defaultDebugValue
    };

    // Expose these for convenience.
    static getOptionRepresentative = getOptionRepresentative;
    static getOptionLabel = selectorProps.getOptionLabel;

    render() {
      return (
        <SimpleConstraintGroupingSelector
          getOptionRepresentative={getOptionRepresentative}
          {...selectorProps}
          {...this.props}
        />
      );
    }
  }
};
