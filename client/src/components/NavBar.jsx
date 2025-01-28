import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { WebSocketsContext } from "../context/WebSocketsContext";
import { useTheme } from "../context/ThemeContext";
import { FaBars } from "react-icons/fa";

function NavBar() {
  const messages = useContext(WebSocketsContext) || {};
  const { theme, toggleTheme } = useTheme();
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch drivers from the API
    const fetchDrivers = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/drivers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="px-4"
      style={{
        backgroundColor: `hsl(var(--background))`,
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
        <FaBars size={24} color={`hsl(var(--primary))`} />
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
                  key={driver.phone_number} // Use driver.phone_number as the key
                  to={`/driver/${driver.phone_number}`} // Use driver.phone_number in the URL
                  style={{
                    color: `hsl(var(--foreground))`,
                    backgroundColor: `hsl(var(--background))`,
                  }}
                >
                  {driver.name}
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
              {theme === "light"
                ? "Dark Mode"
                : "Light Mode"}
            </button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
