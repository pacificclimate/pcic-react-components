import { find, isNull, isUndefined } from 'lodash/fp';
import React from 'react';

export default function ReplaceValue({
  name,
  options,
  value,
  onChange,
  canReplace = true,
  onNoChange,
  children
}) {
  // If value replacement is not allowed, do nothing
  if (!canReplace) {
    console.groupEnd();
    return children;
  }

  // Value replacement is allowed...
  const needsReplacing =
    !isNull(value)  // Null is allowed value
    && (
      isUndefined(value)  // undefined = replace me
      || find({ label: value.label }, options).isDisabled  // disabled = replace me
    );

  if (needsReplacing) {
    const replacementValue = find({ isDisabled: false }, options) || null;
    onChange(replacementValue);
    return children;
  }

  // Not replaced: communicate no change (for purposes of cascading)
  onNoChange()
  return children;
}
