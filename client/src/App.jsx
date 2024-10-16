import React, { useState } from "react";
import Maps from "./components/Maps"; // Import the Maps component
import { Col, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "./components/SideNavbar";

function App() {
  const [sidebarSize, setSidebarSize] = useState("");

  const getSizeChange = (sizedata) => {
    setSidebarSize(sizedata);
  };

  // console.log("im cool w not using bootstrap");
  return (
    <>
      <Container fluid>
        <Row>
          <Col xl={sidebarSize}>
            <SideNavbar sendSizeChange={getSizeChange} />
          </Col>
          <Col xl={10}>
            <Maps />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default React.memo(App); // memo helps with performance
