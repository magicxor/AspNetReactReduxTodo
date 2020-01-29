import React from 'react';
import { Switch, Route } from 'react-router';
import { Container, Col, Row } from 'react-bootstrap';
import { NavMenu } from './components/NavMenu';
import { TaskList } from './components/TaskList';
import { About } from './components/About';
import { Home } from './components/Home';

export const App = () => (
  <Container fluid>
    <Row>
      <Col sm={3}>
        <NavMenu />
      </Col>
      <Col sm={9}>
        <Switch>
          <Route exact path='/TaskList'>
            <TaskList />
          </Route>
          <Route exact path='/About'>
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Col>
    </Row>
  </Container>
);
