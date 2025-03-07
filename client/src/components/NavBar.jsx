import { Nav, Navbar, NavDropdown, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Bootstrap overrides for Tailwind colors
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DriversContext } from "../context/DriversContext"; // Import DriversContext
import { FaBars, FaSun, FaMoon, FaInfoCircle } from "react-icons/fa";
import logo from "../assets/AIFSD_Logo.png";
import { useEffect } from "react";

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const { drivers, isLoading } = useContext(DriversContext); // Use DriversContext
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const handleShowModal = () => setShowModal(true); // Show modal
  const handleCloseModal = () => setShowModal(false); // Close modal

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

          {/* Information icon next to Drivers */}
          <Nav.Item className="ms-2 d-flex align-items-center justify-content-center" style={{ margin: 0 }}>
            <FaInfoCircle
              size={20}
              style={{
                color: `hsl(var(--foreground))`,
                cursor: "pointer",
              }}
              onClick={handleShowModal}
            />
          </Nav.Item>
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

      {/* Modal for information */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Safety Score Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>
          <strong>Driver Safety Score</strong>
        </p>
        <p>
          A driver's safety score is calculated as the 
          average of all their trip safety scores from the past 30 days. This score ranges from 
          0 to 100, where 0 represents the highest level of risk and 100 reflects the safest 
          driving behavior.
        </p>
        <br />
        <p>
          The percent change in a driver's safety 
          score is calculated by comparing their current safety score to their most recent previous 
          score. It is determined by subtracting the previous score from the current score, dividing 
          the result by the previous score, and multiplying by 100 to get the percentage. A positive 
          percent change indicates improvement in safety, while a negative change reflects a decline 
          in driving behavior. 
        </p>
        <br />
        <br />
        <p>
          <strong>Trip Safety Score</strong>
        </p>
        <p>
          A trip's safety score is derived from the Predicted Collision Frequency (PCF), a base 
          safety score, and a scaling factor. The score is calculated by subtracting the product 
          of the scaling factor and the PCF from the base trip safety score. The score is then 
          clamped between 0 and 100, where a higher score indicates a safer trip.
        </p>
        <br />
        <p>
          The PCF starts at a base value and is adjusted based on the frequency of risky behaviors 
          detected during the trip. These behaviors include actions such as drinking, eating, 
          using a phone, not wearing a seatbelt, sleeping, smoking, swerving out of lane, driving 
          too close to other vehicles, and whether the driver keeps their hands on the wheel. Each 
          risky behavior increases the PCF by a specific multiplier.
        </p>
        <br />
        <p>
          If multiple risky drivers are detected, a risky drivers multiplier is applied to the PCF.
          The multiplier increases for each risky driver. This contributes to a higher predicted 
          collision frequency.
        </p>
        <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
}

export default NavBar;
