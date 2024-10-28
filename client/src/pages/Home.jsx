import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../components/SideNavbar";
import "../components/styles/fleetdash.css";
import { PiHouseFill } from "react-icons/pi";
import HighRiskDrivers from "../components/fleetdash components/HighRiskDrivers";
import OverallRiskScore from "../components/fleetdash components/OverallRiskScore";

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="Aside">
          <SideNavbar />
        </div>
        <div className="Header">
          <div className="route">
            <PiHouseFill /> / Dashboard
          </div>
          <h1>Fleet Dashboard</h1>
        </div>
        <div className="Main-Top d-flex justify">
          <HighRiskDrivers />
          <OverallRiskScore />
        </div>
        <div className="Main-Bottom"> NOTIFICATION </div>
      </div>
    </>
  );
}
