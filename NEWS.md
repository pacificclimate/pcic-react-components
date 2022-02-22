# News / Release Notes

## 3.1.1

*2022-Feb-22*

* Add SSP emissions scenarios to `EmissionsScenarioSelector` component

## 3.1.0

*2019-Aug-27*

* Add component `TimeOfYearSelector`
* Add component `SelectWithValueReplacement`
* Add HOC `withValueReplacement`

## 3.0.0

*2019-Apr-02*

* [Fix option backgrounds](https://github.com/pacificclimate/pcic-react-components/issues/10). 
  This is a breaking change: option object content has changed. 

## 2.0.1

*2019-Mar-29*

* Add utils/select, components/select/makeStandardSelector to the distribution.

## 2.0.0

*2019-Mar-29*

* [Communicate complete options, not just values (representatives)](https://github.com/pacificclimate/pcic-react-components/issues/4). This is a breaking change.
* [Remove dependency on React Bootstrap](https://github.com/pacificclimate/pcic-react-components/issues/1)
* Refactor code and fix some subtle bugs. In particular fix a big in
  the default `GroupingSelector.replaceInvalidValue` function.
* [Use react-icons icons (to avoid React Bootstrap problems)](https://github.com/pacificclimate/pcic-react-components/issues/5)

## 1.1.1

*2019-Jan-21*

* Add fix for static export weirdness (in `GroupingSelector`)
* Add "Simple" demo
* Add react-select as a dependency!

## 1.1.0 

*2019-Jan-18*

* Add missing component DataspecSelector

## 1.0.0 

*2019-Jan-18*

* Initial release
* Exports components
  * GroupingSelector
  * SimpleConstraintGroupingSelector
  * ModelSelector
  * EmissionsScenarioSelector
  * VariableSelector
  * DataspecSelector
  * TimePeriodSelector
