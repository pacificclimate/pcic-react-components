function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector';
import './DataspecSelector.css';
import { flow, fromPairs, pick, map, uniq } from 'lodash/fp';
import { mapWithKey } from '../../../utils/fp';
export default class DataspecSelector extends Component {
  constructor(...args) {
    super(...args);

    this.getOptionLabel = ({
      representative: {
        start_date,
        end_date,
        ensemble_member
      }
    }) => {
      const eMT = DataspecSelector.ensembleMemberTranslation(this.props.bases);
      return `${eMT[ensemble_member]} (${ensemble_member}), ${start_date}–${end_date}`;
    };
  }

  render() {
    return React.createElement(SimpleConstraintGroupingSelector, _extends({
      getOptionRepresentative: DataspecSelector.getOptionRepresentative,
      getOptionLabel: this.getOptionLabel
    }, this.props));
  }

}
DataspecSelector.propTypes = {
  bases: PropTypes.array.isRequired,
  // List of basis items the selector will build its options from.
  constraint: PropTypes.object,
  // Any option that does not have a context that matches this value
  // is disabled. Replaces prop getOptionIsDisabled' in `GroupingSelector`.
  debug: PropTypes.bool,
  debugValue: PropTypes.any // For debugging, what else?
  // Only props key to this compoonent are declared here.
  // All props are passed through to rendered selector.

};
DataspecSelector.defaultProps = {
  debugValue: 'Dataspec'
};
DataspecSelector.valueProps = 'start_date end_date ensemble_member'.split(' ');

DataspecSelector.getOptionRepresentative = metadatum => pick(DataspecSelector.valueProps, metadatum);

DataspecSelector.ensembleMemberTranslation = meta => flow(map('ensemble_member'), uniq, mapWithKey((ensemble_member, i) => [ensemble_member, `Run ${i + 1}`]), fromPairs)(meta);

DataspecSelector.getOptionLabel = ({
  representative: {
    start_date,
    end_date,
    ensemble_member
  }
}) => `${ensemble_member}, ${start_date}–${end_date}`;