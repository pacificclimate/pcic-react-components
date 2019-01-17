import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import { flow, filter, isMatch, pick, some, sortBy } from 'lodash/fp';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './TimePeriodSelector.css';

var TimePeriodSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(TimePeriodSelector, _Component);

  function TimePeriodSelector() {
    _classCallCheck(this, TimePeriodSelector);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimePeriodSelector).apply(this, arguments));
  }

  _createClass(TimePeriodSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({}, this.props, {
        getOptionValue: TimePeriodSelector.getOptionValue,
        getOptionLabel: TimePeriodSelector.getOptionLabel,
        debugValue: "TimePeriod"
      }));
    }
  }]);

  return TimePeriodSelector;
}(Component);

TimePeriodSelector.valueProps = 'start_date end_date'.split(' ');

TimePeriodSelector.getOptionValue = function (metadatum) {
  return pick(TimePeriodSelector.valueProps, metadatum);
};

TimePeriodSelector.getOptionLabel = function (_ref) {
  var _ref$value = _ref.value,
      start_date = _ref$value.start_date,
      end_date = _ref$value.end_date;
  return "".concat(start_date, "-").concat(end_date);
};

export { TimePeriodSelector as default };