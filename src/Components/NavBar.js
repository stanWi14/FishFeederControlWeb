import React from 'react';
import { Link } from 'react-scroll';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../img/fishfeederlogo.png'

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container fluid>
      <Navbar.Brand as={Link} to="welcome" smooth={true} duration={500}>
          <img
            src={logo}
            alt="Your Logo"
            height="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="generatedevice" smooth={true} duration={500}>
              <h5>Generate Device</h5>
            </Nav.Link>
            <Nav.Link as={Link} to="devicelist" smooth={true} duration={500}>
            <h5>Device List</h5>
            </Nav.Link>
            <Nav.Link as={Link} to="documentation" smooth={true} duration={500}>
            <h5>Documentation</h5>
            </Nav.Link>
            <Nav.Link as={Link} to="about" smooth={true} duration={500}>
            <h5>About Us</h5>
            </Nav.Link>
            {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="action3" smooth={true} duration={500}>
                Action
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="action4" smooth={true} duration={500}>
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="action5" smooth={true} duration={500}>
                Something else here
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="email"
              placeholder="Email"
              className="me-2"
              aria-label="Email"
            />
            <Form.Control
              type="password"
              placeholder="Password"
              className="me-2"
              aria-label="Password"
            />
            <Button variant="outline-success">Login</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
