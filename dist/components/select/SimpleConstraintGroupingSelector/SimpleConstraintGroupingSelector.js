function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import React from 'react';
import './SimpleConstraintGroupingSelector.css';
import { isMatch, some, omit, concat, keys } from 'lodash/fp';
import memoize from 'memoize-one';
import GroupingSelector from '../GroupingSelector';
export default class SimpleConstraintGroupingSelector extends React.Component {
  constructor(...args) {
    super(...args);
    this.makeGetOptionIsDisabled = memoize(constraint =>
    // Returns a `getOptionIsDisabled` function based on the passed in
    // constraint. It is important that the function be a distinct function
    // for each constraint, instead of the same function (object) that closes
    // over the mutable `this.props.constraint`. The change in the value of
    // `getOptionIsDisabled` tells `GroupingSelector` that it must re-render.
    // (Otherwise it has the
    // option not to, which in this case it takes, causing an error if the
    // same-identity, but differently-behaving function is passed in.)
    //
    // (This is a place where JS's otherwise good FP design falls down,
    // and comes down to the broader shortcoming that objects are mutable.)
    //
    // This function is memoized to eliminate false signals that the constraint
    // has changed.
    option => !some(context => isMatch(constraint, context))(option.value.contexts));
  }
  render() {
    return /*#__PURE__*/React.createElement(GroupingSelector, _extends({
      getOptionIsDisabled: this.makeGetOptionIsDisabled(this.props.constraint)
    }, omit(SimpleConstraintGroupingSelector.propsToOmit, this.props)));
  }
}
SimpleConstraintGroupingSelector.propTypes = {
  bases: PropTypes.array.isRequired,
  // List of basis items the selector will build its options from.

  getOptionRepresentative: PropTypes.func.isRequired,
  // Maps a basis item to the `value` property of an option.
  // This function can map many basis items to the same value;
  // GroupingSelector collects all basis items with the same
  // value into a single option.

  getOptionLabel: PropTypes.func,
  // Maps an option to the label (a string) for that option.

  constraint: PropTypes.object,
  // Any option that does not have a context that matches this value
  // is disabled. Replaces prop getOptionIsDisabled' in `GroupingSelector`.

  arrangeOptions: PropTypes.func,
  // Arranges options for consumption by Select.
  // This may mean sorting options, grouping options (as provided for
  // by Select), or any other operation(s) that arrange the options
  // for presentation in Select.

  value: PropTypes.any,
  // The currently selected option.

  onChange: PropTypes.func,
  // Called when a different option is selected.

  debug: PropTypes.bool,
  debugValue: PropTypes.any
  // For debugging, what else?

  // Only props key to this compoonent are declared here.
};
// All props not named here are passed through to the rendered component.
SimpleConstraintGroupingSelector.propsToOmit = ['getOptionIsDisabled', 'constraint'];