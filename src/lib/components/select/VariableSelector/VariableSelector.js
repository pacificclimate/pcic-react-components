import React from 'react';
import { makeStandardSelector } from '../makeStandardSelector';
import { flow, filter, sortBy } from 'lodash/fp';
import { components } from 'react-select';


const arrangeOptions = options => {
  return [
    {
      label: 'Multi-Year Statistic Datasets',
      options: flow(
        filter(o => o.representative.multi_year_mean),
        sortBy('label'),
      )(options),
    },
    {
      label: 'Time Series Datasets',
      options: flow(
        filter(o => !o.representative.multi_year_mean),
        sortBy('label'),
      )(options),
    },
  ];
};


const makeMenuItem = Wrapper =>
  props => (
    <Wrapper {...props}>
      {props.data.representative.multi_year_mean ? '(MY)' : '(TS)'}
      {' '}
      {props.data.label}
    </Wrapper>
  );

const Option = makeMenuItem(components.Option);
const SingleValue = makeMenuItem(components.SingleValue);


const VariableSelector = makeStandardSelector({
  defaultDebugValue: 'Variable',
  representativeProps: 'variable_id variable_name multi_year_mean'.split(' '),
  selectorProps: {
    getOptionLabel: ({ representative: { variable_id, variable_name }}) =>
      `${variable_id} - ${variable_name}`,
    arrangeOptions,
    components: { Option, SingleValue },
  }
});

export default VariableSelector;
