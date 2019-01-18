# PCIC React Components

An `npm`-installable package of PCIC-developed React components for use across 
projects.

## Installation

This package is not published to a Node package registry.
Instead, it is installed directly from GitHub, as follows:

Using SSH protocol (preferred):
```bash
npm install git+ssh://git@github.com/pacificclimate/pcic-react-components.git
```

Using HTTPS protocol:
```bash
npm install git+https://git@github.com/pacificclimate/pcic-react-components.git
```

From there, `pcic-react-components` is like any other installed package,
and components are imported in JS code the usual way:

```js
import { ExampleComponent } from 'pcic-react-components';
```

## Contents

### Selectors

These components provide selectors specialized to the purposes of 
Climate Explorer, Plan2Adapt, and other apps.

#### Core selectors

Although these selectors were developed to support specific PCIC apps,
they are quite general and provide plug-in points (properties) that enable
their specialization in a variety of ways.

These selectors wrap [React Select v2](https://react-select.com/home).

##### `GroupingSelector`

##### `SimpleConstraintGroupingSelector`

#### Selectors specialized for Climate Explorer and related apps

These selectors wrap `SimpleConstraintGroupingSelector`.

These selectors handle Climate Explorer backend metadata 
(output of `/multimeta` endpoint) as option bases (see `GroupingSelector`).

##### `ModelSelector`

Presents list of unique models found in CE metadata list.

Selector value is a string containing the `model_id` (as used in CE metadata).


##### `EmissionsScenarioSelector`

Presents list of unique emissions scenarios found in CE metadata list.

Emissions scenarios are presented in more human-readable format 
(e.g., encoding "historical, rcp45" is presented as "Historical, then RCP 4.5").

Selector value is a string containing the `experiment` (as used in CE metadata).

##### `VariableSelector`

Presents list of unique variables found in CE metadata list, 
each one characterized by a unique set of
values for the following subset of CE metadata values:

```js
{
  variable_id: String,
  variable_name: String,
  multi_year_mean: Boolean,
}
```

Note that distinct variables can have the same `variable_id` and `multi_year_mean`,
but differ on `variable_name`. This is arguably an incorrect way of naming variables,
but it's what we've got and this selector handles that. The distinction between
variables that differ only on `variable_name` is usually the period over which
they apply (e.g., monthly vs. annual), and so far only occurs for Climdex variables.

It can be similarly argued that a variable with 
`multi_year_mean === false` vs one with `multi_year_mean === true`
is actually a different variable (e.g., `pr` vs. `pr_mym`), but this is also
what we've got, hence this trio of values that encode the full identity of 
a variable.

Options are grouped by `multi_year_mean`. 
Each option bears an icon denoting the value of `multi_year_mean`.

Selector value is an object of the shape above.

##### `DataspecSelector`

Presents a list of the unique "dataspecs" found in the CE metadata list,
each one characterized by a unique set of
values for the following subset of CE metadata values:

```js
{
  start_date: String,
  end_date: String,
  ensemble_member: Boolean,
}
```

Unique values of `ensemble_member` (which are run codes such as `'r1i1p1'`) 
are mapped to the more human-friendly form "Run 1", "Run 2", etc.

Selector value is an object of the shape above.

## Contributing and "publishing"

We put the term "publishing" in quotes because we don't publish to a
Node registry, we just push package contents to GitHub and `npm install`
the package directly from GitHub. (See Installation above.)

Important:

* Only content under the `src/lib` subtree 
  is included in the package that is built. 

* Content outside the `src/lib` subtree is excluded from the package,
  but is allowed and can be extremely useful; for example, to
  create demonstrations of package content (see `src/demo` subtree).

* Each item exported by the package must be exported in the file 
  `src/lib/index.js`.

### Publishing

When you modify this package (i.e., when you modify the contents of the 
`src/lib` subtree), follow this procedure:

1. Make sure you export any new or renamed components in `src/lib/index.js`.

1. When all modifications have been completed, commit the code.

1. On the command line, `npm run build`. 
A successful build will output something like the following:

```text
> pcic-react-components@0.1.0 build /home/rglover/code/pcic-react-components
> rimraf dist && NODE_ENV=production babel src/lib --out-dir dist --copy-files --ignore __tests__,spec.js,test.js,__snapshots__

Successfully compiled 18 files with Babel.
```

1. A successful build on changed `src/lib` content will cause files in the
`dist/` subtree to be modified. Commit these modifications.

1. Push your commits to GitHub.

## Development

This package is developed using [Create React App](https://github.com/facebook/create-react-app)
as the basis. To do this takes a little effort, but is worth it for the
following reasons:

1. All the out-of-box language and dev support benefits:

   * React, JSX, ES6, TypeScript and Flow syntax support.

   * Language extras beyond ES6 like the object spread operator.

   * Autoprefixed CSS, so you don’t need -webkit- or other prefixes.

   * A fast interactive unit test runner with built-in support for coverage reporting.

   * A live development server that warns about common mistakes.

   * A build script to bundle JS, CSS, and images for production, with hashes and sourcemaps.

   * An offline-first service worker and a web app manifest, meeting all the Progressive Web App criteria. (Note: Using the service worker is opt-in as of react-scripts@2.0.0 and higher)

1. Hassle-free updates for the above tools with a single dependency.

1. Easy to create demonstration apps for the components under development

1. Familiarity

1. Exact correspondence to our production environment (not that free-standing React components could depend much on the dev vs. prod environments, but ...)

After [reviewing a variety of ways](https://pcic.uvic.ca/confluence/display/CSG/Creating+an+npm+package+of+React+components+using+create-react-app) 
to adapt a Create React App project to package development, 
we chose what appears to be the simplest, implemented through
[`create-component-lib`](https://www.npmjs.com/package/create-component-lib).

With a small amount of tweaking, this worked out.