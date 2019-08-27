import React from 'react';
import ReactDOM from 'react-dom';
import SelectWithValueReplacement from '../SelectWithValueReplacement';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(React.createElement(SelectWithValueReplacement, {
    onChange: () => {}
  }), div);
});