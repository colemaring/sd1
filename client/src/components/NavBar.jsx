import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DriversContext } from "../context/DriversContext"; // Import DriversContext
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/AIFSD_Logo.png";
import { useEffect } from "react";

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const { drivers, isLoading } = useContext(DriversContext); // Use DriversContext

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme && currentTheme !== theme) {
      toggleTheme();
    }
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
      <Navbar.Brand as={Link} to="/" className="flex items-center">
        <img
          src={logo}
          alt="AIFSD Logo"
          className="logo"
          style={{
            height: "40px",
            transform: "scale(1.3)",
            transformOrigin: "left center",
            marginLeft: "-10px",
          }}
        />
      </Navbar.Brand>

      {/* Mobile dark mode toggle: visible only on mobile */}
      <div
        onClick={toggleTheme}
        className="cursor-pointer d-lg-none me-2"
        style={{
          color: `hsl(var(--foreground))`, // Use theme HSL variable instead of black/white
        }}
      >
        {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
      </div>

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
          <NavDropdown title="Drivers" id="collapsible-nav-dropdown">
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
      </Navbar.Collapse>

      {/* Desktop dark mode toggle: hidden on mobile */}
      <Nav.Item className="d-none d-lg-flex align-items-center">
        <div
          onClick={toggleTheme}
          className="cursor-pointer"
          style={{
            color: `hsl(var(--foreground))`, // Use theme HSL variable instead of black/white
          }}
        >
          {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
        </div>
      </Nav.Item>
    </Navbar>
  );
}

export default NavBar;
