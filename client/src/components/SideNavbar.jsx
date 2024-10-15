import React from "react";
import { Nav } from "react-bootstrap";
import { useState } from "react";
import "../App.css";
import { MdOutlineLocationOn, MdCommute } from "react-icons/md";
import { IoCarOutline } from "react-icons/io5";



// TODO: Link pages
export default function SideNavbar() {
  const [active, setActive] = useState("default");
  return (
    <>
      <Nav
        variant="pills"
        className="flex-column me-auto .pills.active.rounded-circle"
        defaultActiveKey="Map"
        onSelect={(selectedKey) => setActive(selectedKey)}
      >
        <Nav.Item className="header-ai">AI for Safe Driving</Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Map">
          <MdOutlineLocationOn size={30}/> {"  "}Fleet Map
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="fw-lighter border-bottom">Statistics</Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Fleet">
          <MdCommute size={30}/> {"  "}Fleet
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Driver">
          <IoCarOutline size={30}/> {"  "} Driver
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}
