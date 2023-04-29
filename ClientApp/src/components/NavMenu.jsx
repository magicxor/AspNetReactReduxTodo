import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faTasks, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faTasks, faInfoCircle);

export const NavMenu = () => (
  <Navbar bg="light" className="flex-column">
    <Navbar.Brand>ReactReduxTodo</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="navbar-nav flex-column">
        <Nav.Link as={RouterLink} to="/">
          <FontAwesomeIcon icon="home" />
          {' '}
          Home
        </Nav.Link>
        <Nav.Link as={RouterLink} to="/TaskList">
          <FontAwesomeIcon icon="tasks" />
          {' '}
          Task list
        </Nav.Link>
        <Nav.Link as={RouterLink} to="/About">
          <FontAwesomeIcon icon="info-circle" />
          {' '}
          About
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
