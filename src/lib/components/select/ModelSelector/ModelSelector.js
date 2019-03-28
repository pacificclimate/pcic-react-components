import { makeStandardSelector } from '../makeStandardSelector';

const ModelSelector = makeStandardSelector({
  defaultDebugValue: 'Model',
  representativeProps: ['model_id'],
  getOptionLabel: option => option.representative.model_id,
});

export default ModelSelector;
