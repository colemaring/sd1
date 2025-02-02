import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DriversContext } from "../context/DriversContext"; // Import DriversContext
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/AIFSD_Logo.svg";

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const drivers = useContext(DriversContext); // Use DriversContext

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
            <div
              onClick={toggleTheme}
              className="cursor-pointer"
              style={{
                color: theme === "light" ? "black" : "white", // Set icon color based on theme
              }}
            >
              {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}{" "}
              {/* Toggle icon */}
            </div>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
