import { flow, isMatch, map, some } from 'lodash/fp';
import { groupByGeneral } from '../../utils/fp';

export const makeOptionsFromItems = (
  {
    getOptionRepresentative,
    getOptionLabel = option => option.value.representative.toString(),
    getOptionIsDisabled = () => false,
  },
  items
) => {
  return flow(
    // Construct objects containing both the item (context) and representative.
    map(item => ({
      context: item,
      representative: getOptionRepresentative(item),
    })),

    // Group these objects by representative. Each group has a `by` prop, which
    // is the representative it was grouped by, and an `items` prop, which is
    // a list of all items sharing the same `by` value.
    groupByGeneral(({ representative }) => representative),

    // Convert groups to partial React Select option objects. Each such object
    // contains only the required `value` prop, which is converted to a simpler
    // and more convenient from the group.
    map(group => ({
      value: {
        // Context(s) is the items sharing the same representative.
        contexts: map(item => item.context)(group.items),
        representative: group.by,
      },
    })),

    // Complete the React Select option. Prop `label` is always required.
    map(option => ({
      value: option.value,
      label: getOptionLabel(option),
      isDisabled: getOptionIsDisabled(option),
    })),
  )(items);
}


export const makeGetOptionIsDisabled = constraint => option =>
  !some(context => isMatch(constraint, context))(option.value.contexts);
