import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { flow, filter, isMatch, pick, some, sortBy } from 'lodash/fp';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './VariableSelector.css';
import { components } from 'react-select';
var Option = components.Option;

var VariableSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(VariableSelector, _Component);

  function VariableSelector() {
    _classCallCheck(this, VariableSelector);

    return _possibleConstructorReturn(this, _getPrototypeOf(VariableSelector).apply(this, arguments));
  }

  _createClass(VariableSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({
        isSearchable: true,
        placeholder: 'Type here to search list...',
        getOptionValue: VariableSelector.getOptionValue,
        getOptionLabel: VariableSelector.getOptionLabel,
        arrangeOptions: VariableSelector.arrangeOptions,
        components: {
          Option: VariableSelector.Option
        }
      }, this.props, {
        debug: false,
        debugValue: "Variable"
      }));
    }
  }]);

  return VariableSelector;
}(Component);

VariableSelector.valueProps = 'variable_id variable_name multi_year_mean'.split(' ');

VariableSelector.getOptionValue = function (metadatum) {
  return pick(VariableSelector.valueProps, metadatum);
};

VariableSelector.getOptionLabel = function (_ref) {
  var _ref$value = _ref.value,
      variable_id = _ref$value.variable_id,
      variable_name = _ref$value.variable_name;
  return "".concat(variable_id, " - ").concat(variable_name);
};

VariableSelector.arrangeOptions = function (options) {
  return [{
    label: 'Multi-Year Mean Datasets',
    options: flow(filter(function (o) {
      return o.value.multi_year_mean;
    }), sortBy('label'))(options)
  }, {
    label: 'Time Series Datasets',
    options: flow(filter(function (o) {
      return !o.value.multi_year_mean;
    }), sortBy('label'))(options)
  }];
};

VariableSelector.Option = function (props) {
  return React.createElement(Option, props, React.createElement(Glyphicon, {
    glyph: props.value.multi_year_mean ? 'repeat' : 'star'
  }), ' ', props.label);
};

export { VariableSelector as default };