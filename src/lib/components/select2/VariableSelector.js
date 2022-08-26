import React, { useMemo } from 'react';
import Select from 'react-select';
import ReplaceValueOrRender from './ReplaceValueOrRender';
import { makeOptionsFromItems, makeGetOptionIsDisabled } from './utils';

export default function VariableSelector({
  bases, constraint, value, onChange, canReplace, setSettled, ...rest
}) {
  console.group("VariableSelector")
  console.log("constraint", constraint)
  const options = useMemo(() => makeOptionsFromItems(
    {
      getOptionRepresentative:
        ({ variable_id, variable_name, multi_year_mean }) =>
          ({ variable_id, variable_name, multi_year_mean }),
      getOptionLabel: ({ value: { representative: { variable_id, variable_name }}}) =>
        `${variable_id} - ${variable_name}`,
      getOptionIsDisabled: makeGetOptionIsDisabled(constraint),
    },
    bases
  ), [bases, constraint]);
  console.log("options", options)

  return (
    <ReplaceValueOrRender
      name={"VariableSelector"}
      options={options}
      value={value}
      onChange={onChange}
      canReplace={canReplace}
      setSettled={setSettled}
    >
      <Select
        options={options}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </ReplaceValueOrRender>
  );
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
}
