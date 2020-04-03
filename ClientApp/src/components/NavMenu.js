import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faTasks, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faTasks, faInfoCircle);

export const NavMenu = props => (
  <Navbar bg="light" className="flex-column">
    <Navbar.Brand>ReactReduxTodo</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="navbar-nav flex-column">
        <Nav.Link as={NavLink} to="/" exact><FontAwesomeIcon icon='home' /> Home</Nav.Link>
        <Nav.Link as={NavLink} to="/TaskList" exact><FontAwesomeIcon icon='tasks' /> Task list</Nav.Link>
        <Nav.Link as={NavLink} to="/About" exact><FontAwesomeIcon icon='info-circle' /> About</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
