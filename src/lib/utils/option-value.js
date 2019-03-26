import { find, flatMap, isArray } from 'lodash/fp';


// TODO: Rename this more specifically? It is just one way to do it.
export const replaceInvalidValue = options => {
  // Return first (in order of UI presentation) enabled option,
  // or else null if no such option exists.
  const allOptions =
    options[0] && isArray(options[0].options) ?
      flatMap('options')(options) :  // grouped
      options;                       // ungrouped
  const firstEnabledOption = find({ isDisabled: false }, allOptions);
  console.log(`replaceInvalidValue: firstEnabledOption:`, firstEnabledOption)
  // This is sketchy, because if there is never any enabled option,
  // it always returns `undefined`, which is invalid, and causes an infinite
  // update loop. OTOH, if we convert the undefined to `null`, it can
  // prematurely update the value to `null`, and that is both stable
  // and wrong. This works for now.
  // FIXME by adjusting the logic for replacement to allow checking for
  // a valid value in the case that the last value was null. Then use
  // the commented out line below to convert undefined to null.
  return firstEnabledOption && firstEnabledOption.value;
  // return firstEnabledOption ? firstEnabledOption.value : null;
};