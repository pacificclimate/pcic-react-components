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
//  - Each element of the basis list is mapped to a representative value
//    (which can be an arbitrary JS object). Many basis
//    elements can map to the same representative. The user supplies
//    the function that maps basis item to representative.
//
//  - Each unique representative becomes an option in the selector.
//    An option is an object containing the following properties:
//
//      - `representative`: The representative.
//
//      - `contexts`: The list of all basis items which mapped to the option's
//        representative.
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
//
//    By default, `arrangeOptions` sorts the options by the label string.
//
//  - If an invalid value is supplied to the selector, it is replaced with the
//    value returned by the function prop `replaceInvalidValue`. An invalid
//    value is any value that does not match an enabled option value, or `null`.
//    `null` is a valid value, and has the universal meaning, 'no selection'.
//    Warning: This function must eventually return a valid value, or an
//    infinite update loop will occur.
//
//    By default, `replaceInvalidValue` is a function that returns the value
//    of the first enabled option.

import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

import memoize from 'memoize-one';

import {
  assign,
  flow,
  constant,
  map,
  find,
  sortBy,
  tap,
  isFunction,
  isUndefined,
  noop,
  concat,
  omit,
} from 'lodash/fp';
import { groupByGeneral } from '../../../utils/fp';

import objectId from '../../../debug-utils/object-id';

import './GroupingSelector.css';
import { flattenOptions, isValidValue } from '../../../utils/select';

export default class GroupingSelector extends React.Component {
  static propTypes = {
    bases: PropTypes.array.isRequired,
    // List of basis items the selector will build its options from.

    getOptionRepresentative: PropTypes.func.isRequired,
    // Maps a basis item to the `representative` property of an option.
    // This function can map many basis items to the same representative;
    // GroupingSelector collects all basis items with the same
    // representative into a single option.

    getOptionLabel: PropTypes.func,
    // Maps an option to the label (a string) for that option.

    getOptionIsDisabled: PropTypes.func,
    // Maps an option to a value for its isDisabled property.
    // Typically makes use of option.context to determine this.

    arrangeOptions: PropTypes.func,
    // Arranges options for consumption by Select.
    // This may mean sorting options, grouping options (as provided for
    // by Select), or any other operation(s) that arrange the options
    // for presentation in Select.

    replaceInvalidValue: PropTypes.func,
    // Called when `props.value` is not a valid option.
    // Called with list of all options.
    // Must (eventually) return a valid value.
    // Beware: If you always return an invalid value from this, you're screwed.

    value: PropTypes.any,
    // The currently selected option.

    onChange: PropTypes.func,
    // Called when a different option is selected.

    debug: PropTypes.bool,
    debugValue: PropTypes.any,
    // For debugging, what else?

    // Only props key to this compoonent are declared here.
  };

  // All props not named here are passed through to the rendered component.
  static propsToOmit = concat(
    // keys(GroupingSelector.propTypes),
    // Insanely, when the above code is exported and imported into an different
    // package, it fails (the list of keys is empty). Therefore this ...
    [
      'bases',
      'getOptionRepresentative',
      'getOptionLabel',
      'getOptionIsDisabled',
      'arrangeOptions',
      'replaceInvalidValue',
      'debug',
      'debugValue',
    ],
    ['options'],
  );

  static defaultProps = {
    getOptionLabel: option => option.value.representative.toString(),

    getOptionIsDisabled: constant(false),

    arrangeOptions: options => sortBy('label')(options),

    replaceInvalidValue: (options, value) => {
      // Return first (in order of UI presentation) enabled option,
      // or else null if no such option exists.
      const firstEnabledOption =
        find({ isDisabled: false }, flattenOptions(options));
      console.log(`GroupingSelector[...].replaceInvalidValue: firstEnabledOption:`, firstEnabledOption)
      // Prevent infinite update loop: If there is no enabled option and
      // if the previous value was also undefined, return `null`.
      // This interrupts the case where the options list repeatedly does not
      // contain any enabled option, which does occur transiently in several
      // situations.
      // This will cause the value to settle on `null` for situations where
      // we would have to wait for more than one update cycle to get a list
      // of options containing an enabled option, but this works and it
      // definitely prevents a known problem.
      if (isUndefined(firstEnabledOption) && isUndefined(value)) {
        return null;
      }
      return firstEnabledOption;
    },

    onChange: noop,

    debug: false,
    debugValue: '',
  };

  log(...args) {
    if (this.props.debug) {
      console.log(`GroupingSelector[${this.props.debugValue}]`, ...args);
    }
  }

  constructor(props) {
    super(props);
    this.log(`.cons: meta:`, objectId(props.bases), props.bases)
  }

  // Conditionally replace the provided value with a different value.
  // The condition, `this.willReplaceValue`, and the replacement value,
  // `this.valueToUse`, are set in `render`. The value is replaced by
  // calling `props.onChange`. React lifecycle constraints forbid calling
  // `onChange` (triggering a state update) in `render`; instead it must be done
  // in `componentDidMount` or `componentDidUpdate`, where side effects are
  // permitted.

  condReplaceValue() {
    if (this.willReplaceValue) {
      this.log(`.condReplaceValue: replacing with option:`, this.valueToUse)
      this.props.onChange(this.valueToUse);
    }
  }

  componentDidMount() {
    this.condReplaceValue();
  }

  componentDidUpdate(prevProps) {
    this.log(`.cDU: meta:`, objectId(this.props.bases))
    this.log(`.componentDidMount: props.meta ${this.props.bases === prevProps.bases ? '===' : '!=='} prevProps.meta`)
    this.condReplaceValue();
  }

  // Memoize computation of options list
  // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

  // Form the list of base options (without isDisabled property) from the
  // list of metadata. An option item has the following form:
  //
  //  {
  //    representative: <object>
  //      The representative value of the option.
  //    context: [ <object> ]
  //      The contexts in which the option occurs. A context is a basis item
  //      from which an equal option representative value is generated.
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
  // such as `abledOptions` and `props.arrangeOptions`.
  baseOptions = memoize(
    (getOptionRepresentative, getOptionLabel, meta) =>
      flow(
        tap(meta => this.log(`.baseOptions: meta:`, objectId(meta), meta)),
        map(m => ({
          context: m,
          representative: getOptionRepresentative(m),
        })),
        groupByGeneral(({ representative }) => representative),
        map(group => ({
          value: {
            contexts: map(item => item.context)(group.items),
            representative: group.by,
          },
        })),
        map(option => assign(option, { label: getOptionLabel(option) })),
        // tap(m => this.log(`.baseOptions`, m)),
      )(meta)
  );

  // Form the list of "abled" (enabled/disabled) options from the list of
  // metadata. Set `isDisabled` using `props.getOptionIsDisabled`.
  abledOptions = memoize(
    (getOptionRepresentative, getOptionLabel, getOptionIsDisabled, meta) => flow(
      tap(options => {
        this.log(`.abledOptions: meta:`, objectId(meta), meta, 'getOptionIsDisabled:', objectId(getOptionIsDisabled));
        this.log(`.abledOptions: options:`, objectId(options), options);
      }),
      map(option =>
        assign(option, { isDisabled: getOptionIsDisabled(option) })
      ),
      tap(options => this.log(`.abledOptions: result`, options))
    )(
      // Can't curry a memoized function; have to put it into the flow manually
      this.baseOptions(getOptionRepresentative, getOptionLabel, meta)
    )
  );

  render() {
    // Generate options for React Select v2 component.
    this.log(`.render: arrangedOptions: meta:`, objectId(this.props.bases), this.props.bases)
    const abledOptions = this.abledOptions(
      this.props.getOptionRepresentative,
      this.props.getOptionLabel,
      this.props.getOptionIsDisabled,
      this.props.bases,
    );
    const arrangedOptions = this.props.arrangeOptions(abledOptions);
    this.log(`.render: arrangedOptions: result:`, arrangedOptions)

    // Replace an invalid value (option).
    //
    // The following two instance properties are picked up in lifecycle hooks
    // `componentDidMount` and `componentDidUpdate`, which call back
    // (via `onChange`) as needed with the replaced value.
    // We cannot call back here, because the React lifecycle requires
    // `render` to be a pure (i.e., without side effects) function.
    this.willReplaceValue =
      isFunction(this.props.replaceInvalidValue) &&
      !isValidValue(arrangedOptions, this.props.value);

    this.valueToUse =
      this.willReplaceValue ?
        this.props.replaceInvalidValue(arrangedOptions, this.props.value) :
        this.props.value;

    return (
      <Select
        options={arrangedOptions}
        value={this.valueToUse}
        {...omit(GroupingSelector.propsToOmit, this.props)}
      />
    );
  }
}
