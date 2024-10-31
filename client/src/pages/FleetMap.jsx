import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Maps from "../components/Maps";
import "../App.css";
import SideGrid from "../components/sidebar/SideGrid";

export default function FleetDash() {
  return (
    <>
      <SideGrid />
      <Maps />
    </>
  );
}
