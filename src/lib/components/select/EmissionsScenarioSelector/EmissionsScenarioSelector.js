import { makeStandardSelector } from '../makeStandardSelector';
import {
  flow, split, map, join,
} from 'lodash/fp';


const formattedPart = {
  historical: 'Historical',
  rcp26: 'RCP 2.6',
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
};

const formatPart = part => {
  try {
    return formattedPart[part];
  } catch {
    return part;
  }
};

const getOptionLabel = option => (
  flow(
    split(/\s*,\s*/),
    map(formatPart),
    join(', then '),
  )(option.representative.experiment)
);

const EmissionsScenarioSelector = makeStandardSelector({
  defaultDebugValue: 'Emissions',
  representativeProps: ['experiment'],
  getOptionLabel,
});

export default EmissionsScenarioSelector;
