import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../components/SideNavbar";
import RealTimeWarnings from "../components/RealTimeWarnings";
import { Card, Col, Container, Row } from "react-bootstrap";
import DriversScoreTable from "../components/DriversScoreTable";
import "../App.css";
import Maps from "../components/Maps";
import WarningCount from "../components/WarningCount";

export default function DriverDash() {
  return (
    <div className="dashboard">
      <Container fluid>
        <Row>
          <Col md="2" className="bg-light">
            <SideNavbar />
          </Col>
          <Col md="10">
            <div className="pt-5 h1 ">Driver Dashboard</div>
            <Row>
              <Col md="4">
                <RealTimeWarnings />
                <br></br>
                <WarningCount />
              </Col>
              <Col md="8">just testing some things</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
