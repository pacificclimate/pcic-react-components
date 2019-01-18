import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
// Grouping selector. This component returns a React Select v2 selector with
// a set of options constructed from a list of basis items, many of which
// may be coalesced into (i.e., represented by) a single select option.
//
// The motivation for this selector is to unify the various metadata-based
// selectors (for model, emissions, variable, dataset). Each one reduces
//  a list of metadata items (objects containing props that characterize
//  a dataset, such as model, emissions, variable, start and end date, etc.).
// Each such selector reduces the entire list of metadata to a smaller list
// of unique values that represent a single characteristic (e.g., model).
//
// It works as follows:
//
//  - Each element of the basis list is mapped to a value (which can be an
//    arbitrary JS object) that represents it. Many basis elements can map
//    to the same value. The user supplies the function that maps basis item
//    to representative value.
//
//  - Each unique representative value becomes an option in the selector.
//    An option is an object containing the following properties:
//
//      - `value`: The representative value.
//
//      - `contexts`: The list of all basis items which mapped to this value.
//
//        This list can be used to determine enabled/disabled status of an
//        option, for example.
//
//      - `isDisabled`: Set to `true` if the option is disabled.
//
//        The user supplies the function `getOptionIsDisabled` that maps an
//        option to the value for `isDisabled`. This function can refer to
//        `option.value` and `option.contexts`. By default,
//        `getOptionIsDisabled` always returns `false` (option enabled).
//
//      - `label`: The string presented to the user to represent the option.
//
//        The user supplies the function that maps an option to the label
//        string.
//
//  - The list of generated options is finally passed through a user-supplied
//    function `arrangeOptions` that can be used to sort options, form option
//    groups, or otherwise ready them for consumption by the rendered React
//    Select v2 selector.
//    By default, `arrangeOptions` sorts the options by the label string.
//
//  - The active selection is communicated, via props `value` and `onChange`,
//    as the option value only. (This differs from React Select v2,
//    which communicates the entire option value. Introducing this difference
//    may or may not prove wise; it is convenient for the immeidate application
//    in Climate Exporer.)
//
//  - If an invalid value is supplied to the selector, it is replaced with the
//    value returned by the function prop `replaceInvalidValue`. An invalid
//    value is any value that does not match an enabled option value, or `null`.
//    `null` is a valid value, and has the universal meaning, 'no selection'.
//    Warning: This function must return a valid value, or an error will occur.
//    By default, `replaceInvalidValue` is a function that returns the value
//    of the first enabled option.
import React from 'react';
import Select from 'react-select';
import memoize from 'memoize-one';
import { assign, flow, constant, identity, map, flatMap, find, sortBy, some, tap, isEqual, isArray, isFunction, noop, keys, concat, omit } from 'lodash/fp';
import { groupByGeneral } from '../../../utils/fp';
import objectId from '../../../debug-utils/object-id';
import './GroupingSelector.css';

var GroupingSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(GroupingSelector, _React$Component);

  _createClass(GroupingSelector, [{
    key: "log",
    // All props not named here are passed through to the rendered component.
    value: function log() {
      if (this.props.debug) {
        var _console;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_console = console).log.apply(_console, ["GroupingSelector[".concat(this.props.debugValue, "]")].concat(args));
      }
    }
  }, {
    key: "condReplaceValue",
    value: function condReplaceValue() {
      if (this.willReplaceValue) {
        this.log(".updateInvalidValue: replacing with value:", this.valueToUse);
        this.props.onChange(this.valueToUse);
      }
    }
  }]);

  function GroupingSelector(props) {
    var _this;

    _classCallCheck(this, GroupingSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupingSelector).call(this, props));
    _this.allOptions = memoize(function (getOptionValue, getOptionLabel, meta) {
      return flow(tap(function (meta) {
        return _this.log(".allOptions: meta:", objectId(meta), meta);
      }), map(function (m) {
        return {
          context: m,
          value: getOptionValue(m)
        };
      }), groupByGeneral(function (_ref) {
        var value = _ref.value;
        return value;
      }), map(function (group) {
        return {
          contexts: map(function (item) {
            return item.context;
          })(group.items),
          value: group.by
        };
      }), map(function (option) {
        return assign(option, {
          label: getOptionLabel(option)
        });
      }) // tap(m => this.log(`.allOptions`, m)),
      )(meta);
    });
    _this.constrainedOptions = memoize(function (getOptionIsDisabled, meta) {
      return flow(tap(function (options) {
        _this.log(".constrainedOptions: meta:", objectId(meta), meta, 'getOptionIsDisabled:', objectId(getOptionIsDisabled));

        _this.log(".constrainedOptions: options:", objectId(options), options);
      }), map(function (option) {
        return assign(option, {
          isDisabled: getOptionIsDisabled(option)
        });
      }), tap(function (options) {
        return _this.log(".constrainedOptions: result", options);
      }))( // Can't curry a memoized function; have to put it into the flow manually
      _this.allOptions(_this.props.getOptionValue, _this.props.getOptionLabel, meta));
    });

    _this.isValidValue = function (value) {
      return (// A value is valid if it is null or if it is (deep) equal to the value of
        // some enabled option.
        value === null || some(function (option) {
          return !option.isDisabled && isEqual(option.value, value);
        }, _this.constrainedOptions(_this.props.getOptionIsDisabled, _this.props.bases))
      );
    };

    _this.optionFor = function (value) {
      return (// The option for a value is null if the value is null, or the option
        // whose value (deep) equals the value.
        value === null ? null : find(function (option) {
          return isEqual(option.value, value);
        }, _this.constrainedOptions(_this.props.getOptionIsDisabled, _this.props.bases))
      );
    };

    _this.handleChange = function (option) {
      return _this.props.onChange(option.value);
    };

    _this.log(".cons: meta:", objectId(props.bases), props.bases);

    return _this;
  }

  _createClass(GroupingSelector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.condReplaceValue();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this.log(".cDU: meta:", objectId(this.props.bases));
      this.log(".componentDidMount: props.meta ".concat(this.props.bases === prevProps.bases ? '===' : '!==', " prevProps.meta"));
      this.condReplaceValue();
    } // Memoize computation of options list
    // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    // Form the list of all options (without isDisabled property) from the
    // list of metadata. An option item has the following form:
    //
    //  {
    //    value: <object>
    //      The value of the option; exchanged through props.value
    //      and props.onChange.
    //    contexts: [ <object> ]
    //      The contexts in which the option occurs. A context is a
    //      basis item from which an equal option value is generated.
    //      (Contexts are often used to determine enabled/disabled status,
    //      but this function is not concerned with that status.)
    //    label: <string>
    //      The label for the option that appears in the selector UI.
    //  }
    //
    // This function is memoized because otherwise it would have to reprocess
    // the large list of basis items (`props.bases`) into options every time this
    // component is rendered, which, amongst other cases, is every time a
    // selection is made. Also, this function is potentially called multiple
    // times per render, depending on the behaviour of downstream functions
    // such as `constrainedOptions` and `props.arrangeOptions`.

  }, {
    key: "render",
    value: function render() {
      // Generate options for React Select v2 component.
      this.log(".render: arrangedOptions: meta:", objectId(this.props.bases), this.props.bases);
      var arrangedOptions = this.props.arrangeOptions(this.constrainedOptions(this.props.getOptionIsDisabled, this.props.bases));
      this.log(".render: arrangedOptions: result:", arrangedOptions); // Replace an invalid value.
      //
      // The following two instance properties are picked up in lifecycle hooks
      // `componentDidMount` and `componentDidUpdate`, which call back
      // (via `onChange`) as needed with the replaced value.
      // We cannot call back here, because the React lifecycle requires
      // `render` to be a pure (i.e., without side effects) function.

      this.willReplaceValue = isFunction(this.props.replaceInvalidValue) && !this.isValidValue(this.props.value);
      this.valueToUse = this.willReplaceValue ? this.props.replaceInvalidValue(arrangedOptions) : this.props.value;
      return React.createElement(Select, Object.assign({
        options: arrangedOptions,
        value: this.optionFor(this.valueToUse),
        onChange: this.handleChange
      }, omit(GroupingSelector.propsToOmit, this.props)));
    }
  }]);

  return GroupingSelector;
}(React.Component);

GroupingSelector.propsToOmit = concat(keys(GroupingSelector.propTypes), 'options', 'value', 'onChange');
GroupingSelector.defaultProps = {
  getOptionLabel: function getOptionLabel(option) {
    return option.value.toString();
  },
  getOptionIsDisabled: constant(false),
  arrangeOptions: function arrangeOptions(options) {
    return sortBy('label')(options);
  },
  replaceInvalidValue: function replaceInvalidValue(options) {
    // Return first (in order of UI presentation) enabled option,
    // or else null if no such option exists.
    var allOptions = options[0] && isArray(options[0].options) ? flatMap('options')(options) : // grouped
    options; // ungrouped

    var firstEnabledOption = find({
      isDisabled: false
    }, allOptions);
    console.log("GroupingSelector[...].replaceInvalidValue: firstEnabledOption:", firstEnabledOption); // This is sketchy, because if there is never any enabled option,
    // it always returns `undefined`, which is invalid, and causes an infinite
    // update loop. OTOH, if we convert the undefined to `null`, it can
    // prematurely update the value to `null`, and that is both stable
    // and wrong. This works for now.
    // FIXME by adjusting the logic for replacement to allow checking for
    // a valid value in the case that the last value was null. Then use
    // the commented out line below to convert undefined to null.

    return firstEnabledOption && firstEnabledOption.value; // return firstEnabledOption ? firstEnabledOption.value : null;
  },
  onChange: noop,
  debug: false,
  debugValue: ''
};
export { GroupingSelector as default };