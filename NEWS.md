# News / Release Notes

## 3.3.0

_2025-Sep-17_

- Add SSP 3-7.0 to `EmissionsScenarioSelector` component

## 3.2.0

- Update package versions:
  - react-select to ^5.9.0
  - react-icons to ^5.4.0

## 3.1.1

_2022-Feb-22_

- Add SSP emissions scenarios to `EmissionsScenarioSelector` component

## 3.1.0

_2019-Aug-27_

- Add component `TimeOfYearSelector`
- Add component `SelectWithValueReplacement`
- Add HOC `withValueReplacement`

## 3.0.0

_2019-Apr-02_

- [Fix option backgrounds](https://github.com/pacificclimate/pcic-react-components/issues/10).
  This is a breaking change: option object content has changed.

## 2.0.1

_2019-Mar-29_

- Add utils/select, components/select/makeStandardSelector to the distribution.

## 2.0.0

_2019-Mar-29_

- [Communicate complete options, not just values (representatives)](https://github.com/pacificclimate/pcic-react-components/issues/4). This is a breaking change.
- [Remove dependency on React Bootstrap](https://github.com/pacificclimate/pcic-react-components/issues/1)
- Refactor code and fix some subtle bugs. In particular fix a big in
  the default `GroupingSelector.replaceInvalidValue` function.
- [Use react-icons icons (to avoid React Bootstrap problems)](https://github.com/pacificclimate/pcic-react-components/issues/5)

## 1.1.1

_2019-Jan-21_

- Add fix for static export weirdness (in `GroupingSelector`)
- Add "Simple" demo
- Add react-select as a dependency!

## 1.1.0

_2019-Jan-18_

- Add missing component DataspecSelector

## 1.0.0

_2019-Jan-18_

- Initial release
- Exports components
  - GroupingSelector
  - SimpleConstraintGroupingSelector
  - ModelSelector
  - EmissionsScenarioSelector
  - VariableSelector
  - DataspecSelector
  - TimePeriodSelector
