import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export const Layout = props => (
  <Container fluid>
    <Row>
      <Col sm={3}>
        <NavMenu />
      </Col>
      <Col sm={9}>
        {props.children}
      </Col>
    </Row>
  </Container>
);
