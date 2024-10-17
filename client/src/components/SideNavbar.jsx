import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { MdOutlineLocationOn, MdCommute } from "react-icons/md";
import { IoCarOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";

// TODO: key warning
const SideNavbar = () => {
  const location = useLocation();
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
    { href: "/", icon: <MdOutlineLocationOn size={30} />, label: "Fleet Map" },
    { href: "/fleet", icon: <MdCommute size={30} />, label: "Fleet" },
    { href: "/driver", icon: <IoCarOutline size={30} />, label: "Driver" },
  ];

  return (
    <>
      <Nav variant="pills" activeKey={location.pathname}>
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
            {navItems.map(({ href, icon, label }) => (
              <>
                <Nav.Item key={href}>
                  <Nav.Link href={href}>
                    {icon} {label}
                  </Nav.Link>
                </Nav.Item>
                {label === "Fleet Map" ? (
                  <Nav.Item className="fw-lighter border-bottom">
                    {" "}
                    Statistics
                  </Nav.Item>
                ) : (
                  <span></span>
                )}
              </>
            ))}
          </>
        ) : (
          // Else display only the icons
          <>
            <Button className="collapse-button" onClick={handleToggle}>
              <RxHamburgerMenu size={30} />
            </Button>
            {navItems.map(({ href, icon }) => (
              <Nav.Item key={href}>
                <Nav.Link href={href}>{icon}</Nav.Link>
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
