import { makeStandardSelector } from '../makeStandardSelector';
import { flow, split, map, join } from 'lodash/fp';
const formattedPart = {
  historical: 'Historical',
  rcp26: 'RCP 2.6',
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
  ssp126: 'SSP 1-2.6',
  ssp245: 'SSP 2-4.5',
  ssp585: 'SSP 5-8.5'
};
const formatPart = part => {
  try {
    return formattedPart[part];
  } catch {
    return part;
  }
};
const getOptionLabel = option => flow(split(/\s*,\s*/), map(formatPart), join(', then '))(option.value.representative.experiment);
const EmissionsScenarioSelector = makeStandardSelector({
  defaultDebugValue: 'Emissions',
  representativeProps: ['experiment'],
  selectorProps: {
    getOptionLabel
  }
});
export default EmissionsScenarioSelector;