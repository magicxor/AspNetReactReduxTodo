import { Col, Container, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export const DashboardLayout = ({ children }) => (
  <Container fluid>
    <Row>
      <Col sm={3}>
        <NavMenu />
      </Col>
      <Col sm={9}>
        {children}
      </Col>
    </Row>
  </Container>
);
