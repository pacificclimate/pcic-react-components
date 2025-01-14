var _DataspecSelector;
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector';
import './DataspecSelector.css';
import { flow, fromPairs, pick, map, uniq } from 'lodash/fp';
import { mapWithKey } from '../../../utils/fp';
export default class DataspecSelector extends Component {
  constructor(...args) {
    super(...args);
    // Return an option label including the user-friendly 'Run <n>' names
    // for ensemble_member values.
    this.getOptionLabel = ({
      value: {
        representative: {
          start_date,
          end_date,
          ensemble_member
        }
      }
    }) => {
      const eMT = DataspecSelector.ensembleMemberTranslation(this.props.bases);
      return `${eMT[ensemble_member]} (${ensemble_member}), ${start_date}–${end_date}`;
    };
  }
  render() {
    return /*#__PURE__*/React.createElement(SimpleConstraintGroupingSelector, _extends({
      getOptionRepresentative: DataspecSelector.getOptionRepresentative,
      getOptionLabel: this.getOptionLabel
    }, this.props));
  }
}
_DataspecSelector = DataspecSelector;
DataspecSelector.propTypes = {
  bases: PropTypes.array.isRequired,
  // List of basis items the selector will build its options from.

  constraint: PropTypes.object,
  // Any option that does not have a context that matches this value
  // is disabled. Replaces prop getOptionIsDisabled' in `GroupingSelector`.

  debug: PropTypes.bool,
  debugValue: PropTypes.any
  // For debugging, what else?

  // Only props key to this compoonent are declared here.
  // All props are passed through to rendered selector.
};
DataspecSelector.defaultProps = {
  debugValue: 'Dataspec'
};
DataspecSelector.valueProps = 'start_date end_date ensemble_member'.split(' ');
DataspecSelector.getOptionRepresentative = metadatum => pick(_DataspecSelector.valueProps, metadatum);
// Return an object mapping `ensemble_member` (r-i-p) values to more
// user-friendly 'Run <n>' values. For the current collection of datasets,
// there is almost always only one distinct ensemble_member, and so a
// very simple object mapping the one r-i-p value to 'Run 1'. But this
// will handle all cases.
DataspecSelector.ensembleMemberTranslation = meta => flow(map('ensemble_member'), uniq, mapWithKey((ensemble_member, i) => [ensemble_member, `Run ${i + 1}`]), fromPairs)(meta);
DataspecSelector.getOptionLabel = ({
  value: {
    representative: {
      start_date,
      end_date,
      ensemble_member
    }
  }
}) => `${ensemble_member}, ${start_date}–${end_date}`;