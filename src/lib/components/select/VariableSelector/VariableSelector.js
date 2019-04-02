import React from 'react';
import { makeStandardSelector } from '../makeStandardSelector';
import { flow, filter, sortBy } from 'lodash/fp';
import { components } from 'react-select';
import { TiChartLine, TiFilter } from 'react-icons/ti';
import { MdTimeline } from 'react-icons/md'


const multiYearIcon = <TiFilter/>;
const timeSeriesIcon = <MdTimeline/>;


const arrangeOptions = options => {
  return [
    {
      label: <span>{multiYearIcon} Multi-Year Statistic Datasets</span>,
      options: flow(
        filter(o => o.value.representative.multi_year_mean),
        sortBy('label'),
      )(options),
    },
    {
      label: <span>{timeSeriesIcon} Time Series Datasets</span>,
      options: flow(
        filter(o => !o.value.representative.multi_year_mean),
        sortBy('label'),
      )(options),
    },
  ];
};


const makeMenuItem = Wrapper =>
  props => (
    <Wrapper {...props}>
      {
        props.data.value.representative.multi_year_mean ?
          multiYearIcon :
          timeSeriesIcon
      }
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
    getOptionLabel: ({ value: { representative: { variable_id, variable_name }}}) =>
      `${variable_id} - ${variable_name}`,
    arrangeOptions,
    components: { Option, SingleValue },
  }
});

export default VariableSelector;
