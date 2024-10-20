import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { MdOutlineLocationOn, MdCommute } from "react-icons/md";
import { IoCarOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { Outlet, useLocation, Link } from "react-router-dom";
import "../App.css";

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
    { to: "/", icon: <MdOutlineLocationOn size={30} />, label: "Fleet Map" },
    { to: "/fleet", icon: <MdCommute size={30} />, label: "Fleet" },
    { to: "/driver", icon: <IoCarOutline size={30} />, label: "Driver" },
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
            AI for Safe Driving
            <Button className="collapse-button" onClick={handleToggle}>
              <RxHamburgerMenu size={30} />
            </Button>
          </Nav.Item>
        )}
        {/* If the sidebar is not collapsed, display icons with labels */}
        {!collapsed ? (
          <>
            {navItems.map(({ to, icon, label }) => (
              <React.Fragment key={to}>
                <Nav.Item>
                  <Nav.Link as={Link} to={to} eventKey={to}>
                    {icon} {label}
                  </Nav.Link>
                </Nav.Item>
                {label === "Fleet Map" ? (
                  <Nav.Item
                    key={`${to}-stats`}
                    className="fw-lighter border-bottom"
                  >
                    Statistics
                  </Nav.Item>
                ) : (
                  <span></span>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          // Else display only the icons
          <>
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
