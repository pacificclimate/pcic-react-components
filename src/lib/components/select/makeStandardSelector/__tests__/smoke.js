import React from 'react';
import ReactDOM from 'react-dom';
import makeTemplate from '../makeStandardSelector';
import { noop } from 'underscore';

let Template = makeTemplate({
  defaultDebugValue: 'Test',
  representativeProps: ['test'],
  selectorProps: {
    noop
  }
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Template
      bases={[]}
      getOptionRepresentative={noop}
    />,
    div
  );
});
