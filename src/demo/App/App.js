import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DemoGroupingSelector from '../select/DemoGroupingSelector';
import DemoSimpleConstraintGroupingSelector
  from '../select/DemoSimpleConstraintGroupingSelector';
import DemoSimple from '../select/DemoSimple';
import DemoMev from '../select/CE-usage/DemoMEV';
import DemoP2A from '../select/P2A-usage/DemoP2A';
import DemoTimeOfYear from '../select/CE-usage/DemoTimeOfYear';
import { basename } from '../../lib/utils/nav';

const navSpec = [
  { label: 'GS', path: 'GS', component: DemoGroupingSelector },
  { label: 'SCGS', path: 'SCGS', component: DemoSimpleConstraintGroupingSelector },
  { label: 'Simple', path: 'Simple', component: DemoSimple },
  { label: 'MEV', path: 'MEV', component: DemoMev },
  { label: 'P2A', path: 'P2A', component: DemoP2A },
  { label: 'ToY', path: 'ToY', component: DemoTimeOfYear },
];


export default function App() {
  return (
    <Router
      basename={
        basename(process.env.PUBLIC_URL || process.env.REACT_APP_PUBLIC_URL)
      }
    >
      <div>
        <h1>pcic-react-components</h1>
        <Navbar fluid>
          <Nav>
            {
              navSpec.map(({label, path}) => (
                <LinkContainer to={`/${path}`}>
                  <NavItem eventKey={path}>
                    {label}
                  </NavItem>
                </LinkContainer>
              ))
            }
          </Nav>
        </Navbar>

        <Switch>
          {
            navSpec.map(({path, component}) => (
              <Route path={`/${path}`} component={component}/>
            ))
          }
          <Redirect to={'/Simple'}/>
        </Switch>
      </div>
    </Router>
  );
}
