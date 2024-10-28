import React, { useState } from "react";
import { Nav, Button, NavDropdown } from "react-bootstrap";
import { Outlet, useLocation, Link } from "react-router-dom";
import "./styles/sidebar.css";

// Icons
import { MdOutlineLocationOn } from "react-icons/md";
import { PiHouse } from "react-icons/pi";
import { IoPieChartOutline } from "react-icons/io5";
import { FaCar } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiFilter } from "react-icons/ci";

// TODO: key warning
const SideNavbar = () => {
  const location = useLocation();
  const [active, setActive] = useState("default");
  const [collapsed, setCollapsed] = useState(() => {
    // maintains collapsed state when changing pages
    const saved = localStorage.getItem("navbarCollapsed");
    return saved ? JSON.parse(saved) : false; // default to false
  });

  const handleToggle = () => {
    setCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("navbarCollapsed", JSON.stringify(newState)); // saves new state to local storage
      return newState;
    });
  };

  const navItems = [
    { to: "/", icon: <PiHouse size={30} />, label: "Dashboard" },
    {
      to: "/fleet",
      icon: <MdOutlineLocationOn size={30} />,
      label: "Fleet Map",
    },
    {
      to: "/driver",
      icon: <IoPieChartOutline size={30} />,
      label: "Driver Analytics",
    },
  ];

  return (
    <>
      <Nav
        className="flex-column "
        variant="pills"
        activeKey={location.pathname}
        onSelect={(selectedKey) => setActive(selectedKey)}
      >
        {!collapsed && (
          <Nav.Item className="header-ai">
            <FaCar size={50} className="ps-1" />
            <span className="sidebar-header-text">AI for Safe Driving</span>
            <Button
              className="collapse-button float-end"
              onClick={handleToggle}
            >
              <RxHamburgerMenu size={30} />
            </Button>
          </Nav.Item>
        )}
        {/* If the sidebar is not collapsed, display icons with labels */}
        {!collapsed ? (
          <>
            {navItems.map(({ to, icon, label }) => (
              <React.Fragment key={to}>
                {/* For filtering the Drivers */}
                {label === "Driver Analytics" ? (
                  <div className="d-flex align-items-center">
                    <Nav.Item>
                      <Nav.Link as={Link} to={to} eventKey={to}>
                        {icon} <span className="sidebar-label">{label}</span>
                      </Nav.Link>
                    </Nav.Item>
                    <NavDropdown title={<CiFilter />} id="nav-dropdown">
                      <NavDropdown.Item eventKey="high">
                        High Risk Score
                      </NavDropdown.Item>
                      <NavDropdown.Item eventKey="low">
                        Low Risk Score
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                ) : (
                  <Nav.Item>
                    <Nav.Link as={Link} to={to} eventKey={to}>
                      {icon} <span className="sidebar-label">{label}</span>
                      {/* For filtering the Drivers */}
                    </Nav.Link>
                  </Nav.Item>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          // Else display only the icons
          <>
            <FaCar size={50} className="ps-1" />
            <Button className="collapse-button" onClick={handleToggle}>
              <RxHamburgerMenu size={30} />
            </Button>
            {navItems.map(({ to, icon }) => (
              <Nav.Item key={to}>
                <Nav.Link as={Link} to={to} eventKey={to}>
                  {icon}
                </Nav.Link>
              </Nav.Item>
            ))}
          </>
        )}
      </Nav>
      <Outlet />
    </>
  );
};

export default SideNavbar;
