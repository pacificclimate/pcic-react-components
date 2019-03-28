import React from 'react';
import ReactDOM from 'react-dom';
import Template from '../makeStandardSelector';
import { noop } from 'underscore';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Template/>,
    div
  );
});
