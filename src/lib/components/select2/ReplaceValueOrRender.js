import { find, isNull, isUndefined } from 'lodash/fp';
import React, { useEffect } from 'react';

export default function ReplaceValueOrRender({
  name,
  options,
  value,
  onChange,
  canReplace = true,
  setSettled,
  children
}) {
  console.group(`ReplaceValueOrRender (${name})`)
  console.log(`options`, options)
  console.log(`value`, value)
  console.log(`canReplace`, canReplace)

  if (!canReplace) {
    console.groupEnd();
    return "can't replace";
  }

  if (isNull(value)) {
    console.groupEnd();
    return children;
  }

  if (isUndefined(value) || find({ label: value.label }, options).isDisabled) {
    const replacementValue = find({ isDisabled: false }, options) || null;
    console.log(`### replacementValue`, replacementValue)
    useEffect(() => {
      onChange(replacementValue);
    })
    console.groupEnd();
    return "replacing";
  } else {
    setSettled()
  }

  console.groupEnd();
  return children;
}
