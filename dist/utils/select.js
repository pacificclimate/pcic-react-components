import { find, flatMap, isArray, isEqual, some } from 'lodash/fp';
export const flattenOptions = options => options[0] && isArray(options[0].options) ? flatMap('options')(options) :
// grouped
options; // ungrouped

export const isValidValue = (options, value) =>
// A option is valid if it is null or if it is (deep) equal to an
// enabled option.
// `undefined` is not a valid option
value === null || some(option => !option.isDisabled && isEqual(value, option), flattenOptions(options));
export const optionFor = (options, representative) =>
// The option for a representative is null if the representative is null.
// Otherwise it is the option whose representative (deep) equals the value.
// If there is no such value, the option is undefined.
representative === null ? null : find(option => isEqual(option.representative, representative), options);