import React from 'react';
import { makeStandardSelector } from '../makeStandardSelector';
import { flow, filter, sortBy } from 'lodash/fp';
import { components } from 'react-select';
import { TiChartLine, TiFilter } from 'react-icons/ti';
import { MdTimeline } from 'react-icons/md';
const multiYearIcon = /*#__PURE__*/React.createElement(TiFilter, null);
const timeSeriesIcon = /*#__PURE__*/React.createElement(MdTimeline, null);
const arrangeOptions = options => {
  return [{
    label: /*#__PURE__*/React.createElement("span", null, multiYearIcon, " Multi-Year Statistic Datasets"),
    options: flow(filter(o => o.value.representative.multi_year_mean), sortBy('label'))(options)
  }, {
    label: /*#__PURE__*/React.createElement("span", null, timeSeriesIcon, " Time Series Datasets"),
    options: flow(filter(o => !o.value.representative.multi_year_mean), sortBy('label'))(options)
  }];
};
const makeMenuItem = Wrapper => props => /*#__PURE__*/React.createElement(Wrapper, props, props.data.value.representative.multi_year_mean ? multiYearIcon : timeSeriesIcon, ' ', props.data.label);
const Option = makeMenuItem(components.Option);
const SingleValue = makeMenuItem(components.SingleValue);
const VariableSelector = makeStandardSelector({
  defaultDebugValue: 'Variable',
  representativeProps: 'variable_id variable_name multi_year_mean'.split(' '),
  selectorProps: {
    getOptionLabel: ({
      value: {
        representative: {
          variable_id,
          variable_name
        }
      }
    }) => `${variable_id} - ${variable_name}`,
    arrangeOptions,
    components: {
      Option,
      SingleValue
    }
  }
});
export default VariableSelector;