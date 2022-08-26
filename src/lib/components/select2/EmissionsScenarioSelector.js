import React, { useMemo } from 'react';
import { flow, join, map, split } from 'lodash/fp';
import Select from 'react-select';
import ReplaceValue from './ReplaceValue';
import { makeOptionsFromItems, makeGetOptionIsDisabled } from './utils';

const formattedPart = {
  historical: 'Historical',
  rcp26: 'RCP 2.6',
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
  ssp126: 'SSP 1-2.6',
  ssp245: 'SSP 2-4.5',
  ssp585: 'SSP 5-8.5',
};

const formatPart = part => {
  try {
    return formattedPart[part];
  } catch {
    return part;
  }
};

export default function EmissionsScenarioSelector({
  bases, constraint, value, onChange, canReplace, onNoChange, ...rest
}) {
  console.group("EmissionsScenarioSelector")
  console.log("constraint", constraint)
  const options = useMemo(() => makeOptionsFromItems(
    {
      getOptionRepresentative: ({ experiment }) => ({ experiment }),
      getOptionLabel: option => (
        flow(
          split(/\s*,\s*/),
          map(formatPart),
          join(', then '),
        )(option.value.representative.experiment)
      ),
      getOptionIsDisabled: makeGetOptionIsDisabled(constraint),
    },
    bases
  ), [bases, constraint]);
  console.log("options", options)

  console.groupEnd()
  return (
    <ReplaceValue
      name={"EmissionsScenarioSelector"}
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
