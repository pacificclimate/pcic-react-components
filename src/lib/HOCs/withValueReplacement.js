// Higher-order function that returns a Higher Order Component that adds
// invalid-value replacement to a typical controlled component with props
// `value` and `onChange` (e.g., most UI controls such as dropdown selectors).
//
// (See https://reactjs.org/docs/higher-order-components.html#convention-maximizing-composability
// for why this HOC is separated into two parts like this.)
//
// Invalid-value replacement means that when a value supplied to the component
// is invalid, it is replaced with a valid value by calling `onChange` with
// the new value.
// Invalidity is determined by the function prop `isInvalidValue`.
// Replacement value is computed by the prop `replaceInvalidValue`.
//
// Although the current use case for this HOC is to replace an invalid
// option selection in a selector (e.g., one that has been rendered invalid
// by a change of state) by a currently valid one, it does not, as might be
// tempting, assume anything about the range of possible values or what makes
// a value valid or invalid. It is instead general-purpose and the user must
// pass function props that embody this use case specific knowledge.
//
// Usage example (taken from TimeOfYearSelector):
//
// Suppose the following:
//  - We are using React Select, which takes an array of options each of
//    the form `{ label, value, isDisabled }`
//  - The content of the options array may change from time to time.
//
// const SelectWithValueReplacement = withValueReplacement()(Select);
//
// const isInvalidValue =
//   options => cond([
//     [isNull, constant(false)],
//     [isUndefined, constant(true)],
//     [otherwise, option => find({ value: option.value })(options).isDisabled]
//   ]);
//
// const replaceInvalidValue =
//   options => value => find({ isDisabled: false })(options);
//
// render() {
//   return <BaseWithValueReplacement
//     options={options}
//     value={this.state.value}
//     onChange={this.state.handleChange}
//     replaceInvalidValue={replaceInvalidValue(options)}
//     isInvalidValue={isInvalidValue}
//   />
// }
//
// Note: for greater flexibility, `withValueReplacement` could accept arguments
// naming the `value` and `onChange` props expected by the base component.
// But that is an unnecessary complication at this point.

// TODO: Move to pcic-react-components

import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/fp/isFunction';

export default function withValueReplacement() {
  return function (BaseComponent) {
    return class extends React.Component {
      static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,

        isInvalidValue: PropTypes.func,
        // Returns a boolean indicating whether the value passed in is invalid.

        replaceInvalidValue: PropTypes.func,
        // Called when `props.value` is not a valid value, according to
        // `props.isInvalidValue`.
        // Must (eventually) return a valid value.
        // Beware: If you always return an invalid value, you're screwed.

      };

      // Conditionally replace the provided value with a different value.
      // The value is replaced by calling `props.onChange`. React lifecycle
      // constraints forbid calling `onChange` (triggering a state update)
      // in `render`; instead it must be done in `componentDidMount` or
      // `componentDidUpdate`, where side effects are permitted.

      componentDidMount() {
        this.condReplaceValue();
      }

      componentDidUpdate() {
        this.condReplaceValue();
      }

      condReplaceValue() {
        const { isInvalidValue, replaceInvalidValue } = this.props;
        if (isFunction(replaceInvalidValue) && isInvalidValue(this.props.value)) {
          this.props.onChange(this.props.replaceInvalidValue(this.props.value));
        }
      }

      render() {
        const { isInvalidValue, replaceInvalidValue, ...passThroughProps } =
          this.props;

        return (
          <BaseComponent
            value={this.props.value}
            {...passThroughProps}
          />
        );
      }
    }
  }
}

