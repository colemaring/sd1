import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext } from "react";
import { WebSocketsContext } from "../context/WebSocketsContext";

function NavBar() {
  const messages = useContext(WebSocketsContext);
  const drivers = Object.keys(messages);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Green Saver</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Fleet</Nav.Link>
            
            <NavDropdown title="Drivers" id="collapsible-nav-dropdown">
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <NavDropdown.Item key={driver} href={`/driver/${driver}`}>
                    {driver}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled style={{ color: 'grey' }}>
                  No drivers
                </NavDropdown.Item>
              )}
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