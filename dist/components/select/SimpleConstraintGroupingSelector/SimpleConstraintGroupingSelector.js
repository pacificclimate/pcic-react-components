import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React from 'react';
import './SimpleConstraintGroupingSelector.css';
import { isMatch, some, omit, concat, keys } from 'lodash/fp';
import memoize from 'memoize-one';
import MetadataSelector from '../GroupingSelector';

var SimpleConstraintGroupingSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SimpleConstraintGroupingSelector, _React$Component);

  function SimpleConstraintGroupingSelector() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, SimpleConstraintGroupingSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SimpleConstraintGroupingSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.makeGetOptionIsDisabled = memoize(function (constraint) {
      return (// Returns a `getOptionIsDisabled` function based on the passed in
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
        function (option) {
          return !some(function (context) {
            return isMatch(_this.props.constraint, context);
          })(option.contexts);
        }
      );
    });
    return _this;
  }

  _createClass(SimpleConstraintGroupingSelector, [{
    key: "render",
    value: function render() {
      return React.createElement(MetadataSelector, Object.assign({
        getOptionIsDisabled: this.makeGetOptionIsDisabled(this.props.constraint)
      }, omit(SimpleConstraintGroupingSelector.propsToOmit, this.props)));
    }
  }]);

  return SimpleConstraintGroupingSelector;
}(React.Component);

SimpleConstraintGroupingSelector.propsToOmit = ['getOptionIsDisabled', 'constraint'];
export { SimpleConstraintGroupingSelector as default };