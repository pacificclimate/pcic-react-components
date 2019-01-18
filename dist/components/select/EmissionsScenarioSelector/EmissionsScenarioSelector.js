import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import { flow, split, map, join } from 'lodash/fp';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './EmissionsScenarioSelector.css';

var EmissionsScenarioSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(EmissionsScenarioSelector, _Component);

  function EmissionsScenarioSelector() {
    _classCallCheck(this, EmissionsScenarioSelector);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmissionsScenarioSelector).apply(this, arguments));
  }

  _createClass(EmissionsScenarioSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({
        getOptionValue: EmissionsScenarioSelector.getOptionValue,
        getOptionLabel: EmissionsScenarioSelector.getOptionLabel
      }, this.props));
    }
  }]);

  return EmissionsScenarioSelector;
}(Component);

EmissionsScenarioSelector.defaultProps = {
  debugValue: 'Emissions'
};

EmissionsScenarioSelector.getOptionValue = function (metadatum) {
  return metadatum.experiment;
};

EmissionsScenarioSelector.formattedPart = {
  historical: 'Historical',
  rcp26: 'RCP 2.6',
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5'
};

EmissionsScenarioSelector.formatPart = function (part) {
  try {
    return EmissionsScenarioSelector.formattedPart[part];
  } catch (_unused) {
    return part;
  }
};

EmissionsScenarioSelector.getOptionLabel = function (option) {
  return flow(split(/\s*,\s*/), map(EmissionsScenarioSelector.formatPart), join(', then '))(option.value);
};

export { EmissionsScenarioSelector as default };