import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector';
import './DataspecSelector.css';
import { flow, fromPairs, pick, map, uniq } from 'lodash/fp';
import { mapWithKey } from '../../../utils/fp';

var DataspecSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(DataspecSelector, _Component);

  function DataspecSelector() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DataspecSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DataspecSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getOptionLabel = function (_ref) {
      var _ref$value = _ref.value,
          start_date = _ref$value.start_date,
          end_date = _ref$value.end_date,
          ensemble_member = _ref$value.ensemble_member;
      var eMT = DataspecSelector.ensembleMemberTranslation(_this.props.bases);
      return "".concat(eMT[ensemble_member], " (").concat(ensemble_member, "), ").concat(start_date, "\u2013").concat(end_date);
    };

    return _this;
  }

  _createClass(DataspecSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({
        getOptionValue: DataspecSelector.getOptionValue,
        getOptionLabel: this.getOptionLabel
      }, this.props));
    }
  }]);

  return DataspecSelector;
}(Component);

DataspecSelector.defaultProps = {
  debugValue: 'Dataspec'
};
DataspecSelector.valueProps = 'start_date end_date ensemble_member'.split(' ');

DataspecSelector.getOptionValue = function (metadatum) {
  return pick(DataspecSelector.valueProps, metadatum);
};

DataspecSelector.ensembleMemberTranslation = function (meta) {
  return flow(map('ensemble_member'), uniq, mapWithKey(function (ensemble_member, i) {
    return [ensemble_member, "Run ".concat(i + 1)];
  }), fromPairs)(meta);
};

export { DataspecSelector as default };