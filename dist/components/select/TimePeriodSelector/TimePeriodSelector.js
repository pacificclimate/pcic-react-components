import { makeStandardSelector } from '../makeStandardSelector';
const TimePeriodSelector = makeStandardSelector({
  defaultDebugValue: 'TimePeriod',
  representativeProps: 'start_date end_date'.split(' '),
  selectorProps: {
    getOptionLabel: ({
      value: {
        representative: {
          start_date,
          end_date
        }
      }
    }) => `${start_date}-${end_date}`
  }
});
export default TimePeriodSelector;