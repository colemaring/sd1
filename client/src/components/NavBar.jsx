import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WebSocketsContext } from "../context/WebSocketsContext";
import { useTheme } from "../context/ThemeContext";
import { FaBars } from "react-icons/fa";

function NavBar() {
  const messages = useContext(WebSocketsContext) || {};
  const drivers = Object.keys(messages);

  // Access theme and toggleTheme from ThemeContext
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="shadow px-4"
      style={{
        backgroundColor: `hsl(var(--secondary))`,
        color: `hsl(var(--foreground))`,
      }}
    >
      <Navbar.Brand
        as={Link}
        to="/"
        style={{
          color: `hsl(var(--primary))`,
        }}
      >
        Green Saver
      </Navbar.Brand>
      {/* Custom Hamburger Menu */}
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        style={{
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          boxShadow: "none",
        }}
        className="focus:outline-none"
      >
        <FaBars size={24} color={`hsl(var(--foreground))`} />
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            as={Link}
            to="/fleet"
            style={{
              color: `hsl(var(--foreground))`,
            }}
          >
            Fleet
          </Nav.Link>
          <NavDropdown
            title="Drivers"
            id="collapsible-nav-dropdown"
            className="custom-dropdown"
          >
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <NavDropdown.Item
                  as={Link}
                  key={driver}
                  to={`/driver/${driver}`}
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
            as={Link}
            to="/wstest"
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
    </Navbar>
  );
}

export default NavBar;
