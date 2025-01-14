function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Time of Year selector, based on React Select and with value replacement

import React from 'react';
import PropTypes from 'prop-types';
import cond from 'lodash/fp/cond';
import otherwise from 'lodash/fp/stubTrue';
import constant from 'lodash/fp/constant';
import find from 'lodash/fp/find';
import isNull from 'lodash/fp/isNull';
import isUndefined from 'lodash/fp/isUndefined';
import { mapWithKey } from '../../../utils/fp';
import SelectWithValueReplacement from '../SelectWithValueReplacement';

// `isInvalidValue` examines the *current options list* to determine whether
// the value is invalid (namely, that it matches an option that is disabled).
// This is slightly tricky, but it comes down to `SelectWithValueReplacement`
// (like all `withValueReplacement` outputs) being agnostic about the set
// of possible values, which in this case is a changing (enabled/disabled)
// list of options.
const isInvalidValue = options => cond([[isNull, constant(false)],
// null = no selection
[isUndefined, constant(true)],
// undefined = 'replace me'
[otherwise, option => find({
  value: option.value
})(options).isDisabled]]);

// `replaceInvalidValue` returns the first enabled option in the options list,
// or null (signifying no selection) if no such option exists.
const replaceInvalidValue = options => () => find({
  isDisabled: false
})(options) || null;
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Winter—DJF', 'Spring—MAM', 'Summer—JJA', 'Fall—SON', 'Annual'];
export default class TimeOfYearSelector extends React.Component {
  render() {
    const {
      value,
      onChange,
      monthly,
      seasonal,
      yearly,
      ...rest
    } = this.props;
    const options = mapWithKey((label, index) => ({
      label,
      value: index,
      isDisabled: index < 12 && !monthly || 12 <= index && index < 16 && !seasonal || 16 <= index && !yearly
    }))(labels);
    return /*#__PURE__*/React.createElement(SelectWithValueReplacement, _extends({
      options: options,
      value: this.props.value,
      onChange: this.props.onChange,
      isInvalidValue: isInvalidValue(options),
      replaceInvalidValue: replaceInvalidValue(options)
    }, rest));
  }
}
TimeOfYearSelector.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.any,
  // Using 'function' logs warnings
  monthly: PropTypes.bool,
  // Show month options
  seasonal: PropTypes.bool,
  // Show season options
  yearly: PropTypes.bool // Show annual option
};
TimeOfYearSelector.defaultProps = {
  monthly: true,
  seasonal: true,
  yearly: true
};