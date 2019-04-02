import { makeStandardSelector } from '../makeStandardSelector';

const ModelSelector = makeStandardSelector({
  defaultDebugValue: 'Model',
  representativeProps: ['model_id'],
  selectorProps: {
    getOptionLabel: option => option.value.representative.model_id,
  },
});

export default ModelSelector;
