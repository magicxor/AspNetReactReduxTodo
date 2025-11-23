import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
        <LinkContainer to="/">
          <Nav.Link>
            <FontAwesomeIcon icon="home" /> Home
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/TaskList">
          <Nav.Link>
            <FontAwesomeIcon icon="tasks" /> Task list
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/About">
          <Nav.Link>
            <FontAwesomeIcon icon="info-circle" /> About
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
