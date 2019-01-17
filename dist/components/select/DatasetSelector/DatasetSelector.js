import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import SimpleConstraintGroupingSelector from '../SimpleConstraintGroupingSelector/SimpleConstraintGroupingSelector';
import './DatasetSelector.css';
import { flow, fromPairs, pick, map, uniq } from 'lodash/fp';
import { mapWithKey } from '../../../utils/fp';

var DatasetSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(DatasetSelector, _Component);

  function DatasetSelector() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DatasetSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DatasetSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.getOptionLabel = function (_ref) {
      var _ref$value = _ref.value,
          start_date = _ref$value.start_date,
          end_date = _ref$value.end_date,
          ensemble_member = _ref$value.ensemble_member;
      var eMT = DatasetSelector.ensembleMemberTranslation(_this.props.bases);
      return "".concat(eMT[ensemble_member], " (").concat(ensemble_member, "), ").concat(start_date, "\u2013").concat(end_date);
    };

    return _this;
  }

  _createClass(DatasetSelector, [{
    key: "render",
    value: function render() {
      console.log('DatasetSelector.render');
      return React.createElement(SimpleConstraintGroupingSelector, Object.assign({}, this.props, {
        getOptionValue: DatasetSelector.getOptionValue,
        getOptionLabel: this.getOptionLabel,
        debugValue: "Dataset"
      }));
    }
  }]);

  return DatasetSelector;
}(Component);

DatasetSelector.valueProps = 'start_date end_date ensemble_member'.split(' ');

DatasetSelector.getOptionValue = function (metadatum) {
  return pick(DatasetSelector.valueProps, metadatum);
};

DatasetSelector.ensembleMemberTranslation = function (meta) {
  return flow(map('ensemble_member'), uniq, mapWithKey(function (ensemble_member, i) {
    return [ensemble_member, "Run ".concat(i + 1)];
  }), fromPairs)(meta);
};

export { DatasetSelector as default };