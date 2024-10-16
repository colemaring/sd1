import React from "react";
import { Nav, Button } from "react-bootstrap";
import { useState } from "react";
import "../App.css";
import { MdOutlineLocationOn, MdCommute } from "react-icons/md";
import { IoCarOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

// Will refactor the code later
// TODO: Link pages
export default function SideNavbar({ sendSizeChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("default");
  const data = 2;

  if (!collapsed) {
    const data = 1;
    return (
      <>
        <Nav
          variant="pills"
          className="flex-column me-auto"
          defaultActiveKey="Map"
          onSelect={(selectedKey) => setActive(selectedKey)}
        >
          <Nav.Item className="header-ai">
            AI for Safe Driving
            <Button
              className="collapse-button"
              onClick={() => {
                sendSizeChange(data);
                setCollapsed(true);
              }}
            >
              <RxHamburgerMenu size={30} />
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" eventKey="Map">
              <MdOutlineLocationOn size={30} /> {"  "}Fleet Map
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="fw-lighter border-bottom">Statistics</Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" eventKey="Fleet">
              <MdCommute size={30} /> {"  "}Fleet
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" eventKey="Driver">
              <IoCarOutline size={30} /> {"  "} Driver
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
    );
  }

  return (
    <>
      <Nav
        variant="pills"
        className="flex-column me-auto collapsed"
        defaultActiveKey="Map"
        onSelect={(selectedKey) => setActive(selectedKey)}
      >
        <Button
          className="collapsed-button"
          onClick={() => {
            sendSizeChange(data);
            setCollapsed(false);
          }}
        >
          <RxHamburgerMenu size={30} />
        </Button>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Map">
            <MdOutlineLocationOn size={30} />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Fleet">
            <MdCommute size={30} />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" eventKey="Driver">
            <IoCarOutline size={30} />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}
