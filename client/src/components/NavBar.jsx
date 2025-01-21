import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext } from "react";
import { WebSocketsContext } from "../context/WebSocketsContext";
import { useTheme } from "../context/ThemeContext";

function NavBar() {
  const messages = useContext(WebSocketsContext);
  const drivers = Object.keys(messages);

  // Access theme and toggleTheme from ThemeContext
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="shadow"
      style={{
        backgroundColor: `hsl(var(--secondary))`,
        color: `hsl(var(--foreground))`,
      }}
    >
      <Container>
        <Navbar.Brand
          style={{
            color: `hsl(var(--primary))`,
          }}
        >
          Green Saver
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/"
              style={{
                color: `hsl(var(--foreground))`,
              }}
            >
              Fleet
            </Nav.Link>
            <NavDropdown
              title="Drivers"
              id="collapsible-nav-dropdown"
              menuVariant={theme === "light" ? "light" : "dark"} // Adjusts dropdown background
              className="custom-dropdown"
            >
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <NavDropdown.Item
                    key={driver}
                    href={`/driver/${driver}`}
                    style={{
                      color: `hsl(var(--foreground))`,
                      backgroundColor: `hsl(var(--background))`,
                    }}
                  >
                    {driver}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item
                  disabled
                  style={{
                    color: `hsl(var(--muted-foreground))`,
                    backgroundColor: `hsl(var(--background))`,
                  }}
                >
                  No drivers
                </NavDropdown.Item>
              )}
            </NavDropdown>
            <Nav.Link
              href="/wstest"
              style={{
                color: `hsl(var(--foreground))`,
              }}
            >
              WebSockets testing
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <button
                onClick={toggleTheme}
                className="btn px-3 py-2 rounded"
                style={{
                  backgroundColor: `hsl(var(--primary))`,
                  color: `hsl(var(--primary-foreground))`,
                }}
              >
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
