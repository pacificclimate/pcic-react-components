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
//    (which can be an arbitrary JS object) that represents it. Many basis
//    elements can map to the same representative value. The user supplies
//    the function that maps basis item to representative value.
//
//  - Each unique representative value becomes an option in the selector.
//    An option is an object containing the following properties:
//
//      - `representative`: The representative value.
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

import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

import memoize from 'memoize-one';

import {
  assign,
  flow,
  constant,
  identity,
  map,
  flatMap,
  find,
  sortBy,
  some,
  tap,
  isEqual,
  isArray,
  isFunction,
  noop,
  keys, concat,
  omit,
} from 'lodash/fp';
import { groupByGeneral } from '../../../utils/fp';

import objectId from '../../../debug-utils/object-id';

import './GroupingSelector.css';

export default class GroupingSelector extends React.Component {
  static propTypes = {
    bases: PropTypes.array.isRequired,
    // List of basis items the selector will build its options from.

    getOptionRepresentative: PropTypes.func.isRequired,
    // Maps a basis item to the `representative` property of an option.
    // This function can map many basis items to the same representative value;
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
      'debug',
      'debugValue',
    ],
    ['options'],
  );

  static defaultProps = {
    getOptionLabel: option => option.representative.toString(),

    getOptionIsDisabled: constant(false),

    arrangeOptions: options => sortBy('label')(options),

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

  // Memoize computation of options list
  // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

  // Form the list of all options (without isDisabled property) from the
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
  // such as `constrainedOptions` and `props.arrangeOptions`.
  allOptions = memoize(
    (getOptionRepresentative, getOptionLabel, meta) =>
      flow(
        tap(meta => this.log(`.allOptions: meta:`, objectId(meta), meta)),
        map(m => ({
          context: m,
          representative: getOptionRepresentative(m),
        })),
        groupByGeneral(({ representative }) => representative),
        map(group => ({
          contexts: map(item => item.context)(group.items),
          representative: group.by,
        })),
        map(option => assign(option, { label: getOptionLabel(option) })),
        // tap(m => this.log(`.allOptions`, m)),
      )(meta)
  );

  // Form the list of constrained options from the list of metadata.
  // A constrained option is an option with isDisabled set according to
  // `props.getOptionIsDisabled`.
  constrainedOptions = memoize(
    (getOptionIsDisabled, meta) => flow(
      tap(options => {
        this.log(`.constrainedOptions: meta:`, objectId(meta), meta, 'getOptionIsDisabled:', objectId(getOptionIsDisabled));
        this.log(`.constrainedOptions: options:`, objectId(options), options);
      }),
      map(option =>
        assign(option, { isDisabled: getOptionIsDisabled(option) })
      ),
      tap(options => this.log(`.constrainedOptions: result`, options))
    )(
      // Can't curry a memoized function; have to put it into the flow manually
      this.allOptions(
        this.props.getOptionRepresentative,
        this.props.getOptionLabel,
        meta
      )
    )
  );

  render() {
    // Generate options for React Select v2 component.
    this.log(`.render: arrangedOptions: meta:`, objectId(this.props.bases), this.props.bases)
    const arrangedOptions =
      this.props.arrangeOptions(
        this.constrainedOptions(
          this.props.getOptionIsDisabled,
          this.props.bases,
        ));
    this.log(`.render: arrangedOptions: result:`, arrangedOptions)

    return (
      <Select
        options={arrangedOptions}
        {...omit(GroupingSelector.propsToOmit, this.props)}
      />
    );
  }
}
