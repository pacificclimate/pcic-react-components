import React from 'react';
import ReactDOM from 'react-dom';
import TimeOfYearSelector from '../TimeOfYearSelector';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(/*#__PURE__*/React.createElement(TimeOfYearSelector, {
    onChange: () => {}
  }), div);
});