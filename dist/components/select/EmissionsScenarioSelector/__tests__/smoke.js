import React from 'react';
import ReactDOM from 'react-dom';
import Template from '../EmissionsScenarioSelector';
import { noop } from 'underscore';
it('renders without crashing', function () {
  var div = document.createElement('div');
  ReactDOM.render(React.createElement(Template, null), div);
});