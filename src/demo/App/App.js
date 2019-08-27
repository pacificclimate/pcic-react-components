import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Route, Redirect, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import DemoGroupingSelector from '../select/DemoGroupingSelector';
import DemoSimpleConstraintGroupingSelector from '../select/DemoSimpleConstraintGroupingSelector';
import DemoSimple from '../select/DemoSimple';
import DemoMev from '../select/CE-usage/DemoMEV';
import DemoP2A from '../select/P2A-usage/DemoP2A';
import DemoTimeOfYear from '../select/CE-usage/DemoTimeOfYear';

const navSpec = [
  { label: 'GS', path: 'GS', component: DemoGroupingSelector },
  { label: 'SCGS', path: 'SCGS', component: DemoSimpleConstraintGroupingSelector },
  { label: 'Simple', path: 'Simple', component: DemoSimple },
  { label: 'MEV', path: 'MEV', component: DemoMev },
  { label: 'P2A', path: 'P2A', component: DemoP2A },
  { label: 'ToY', path: 'ToY', component: DemoTimeOfYear },
];


export default class Template extends React.Component {
  static propTypes = {
  };

  state = {
  };

  render() {
    return (
      <Router basename={'/#'}>
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
            <Redirect to={'/SimpleConstraintGroupingSelector'}/>
          </Switch>
        </div>
      </Router>
    );
  }
}
