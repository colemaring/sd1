import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Green Saver</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Fleet</Nav.Link>
            
            <NavDropdown title="Drivers" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/driver">Jane Doe</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">John Doe</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Alice S.</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Bob K.</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                David Smith
              </NavDropdown.Item>
              
            </NavDropdown>
            <Nav.Link href="/wstest">WebSockets testing</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item>Light Mode</Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
