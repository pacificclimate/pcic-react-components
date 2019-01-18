import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './ModelSelector.css';

var ModelSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(ModelSelector, _Component);

  function ModelSelector() {
    _classCallCheck(this, ModelSelector);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModelSelector).apply(this, arguments));
  }

  _createClass(ModelSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({
        getOptionValue: ModelSelector.getOptionValue
      }, this.props));
    }
  }]);

  return ModelSelector;
}(Component);

ModelSelector.defaultProps = {
  debugValue: 'Model'
};

ModelSelector.getOptionValue = function (metadatum) {
  return metadatum.model_id;
};

export { ModelSelector as default };