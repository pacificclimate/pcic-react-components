import React, { useMemo } from 'react';
import Select from 'react-select';
import ReplaceValue from './ReplaceValue';
import { makeOptionsFromItems, makeGetOptionIsDisabled } from './utils';

export default function VariableSelector({
  metadata,
  constraint, value, onChange, canReplace, onNoChange, ...rest
}) {
  console.group("VariableSelector")
  console.log("constraint", constraint)
  const options = useMemo(() => makeOptionsFromItems(
    {
      getOptionRepresentative:
        ({ variable_id, variable_name, multi_year_mean }) =>
          ({ variable_id, variable_name, multi_year_mean }),
      // This is the variable selector. A unique variable is characterized by
      // the combination of these three metadata props.

      getOptionLabel: ({ value: { representative: { variable_id, variable_name }}}) =>
        `${variable_id} - ${variable_name}`,
      // Label

      getOptionIsDisabled: makeGetOptionIsDisabled(constraint),
    },
    metadata
  ), [metadata, constraint]);
  console.log("options", options)

  console.groupEnd()
  return (
    <ReplaceValue
      name={"VariableSelector"}
      options={options}
      value={value}
      onChange={onChange}
      canReplace={canReplace}
      onNoChange={onNoChange}
    >
      <Select
        options={options}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </ReplaceValue>
  );
}
