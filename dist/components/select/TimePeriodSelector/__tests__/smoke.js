import React from 'react';
import ReactDOM from 'react-dom';
import Template from '../TimePeriodSelector';
import { noop } from 'underscore';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(/*#__PURE__*/React.createElement(Template, {
    bases: []
  }), div);
});