import React, { useMemo } from 'react';
import Select from 'react-select';
import ReplaceValueOrRender from './ReplaceValueOrRender';
import { makeOptionsFromItems, makeGetOptionIsDisabled } from './utils';

export default function ModelSelector({
  bases, constraint, value, onChange, canReplace, setSettled, ...rest
}) {
  const options = useMemo(() => makeOptionsFromItems(
    {
      getOptionRepresentative: ({ model_id }) => ({ model_id }),
      getOptionLabel: option => option.value.representative.model_id,
      getOptionIsDisabled: makeGetOptionIsDisabled(constraint),
    },
    bases
  ), [bases, constraint]);
  // console.log("### ModelSelector options", options)

  return (
    <ReplaceValueOrRender
      name={"ModelSelector"}
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
}
