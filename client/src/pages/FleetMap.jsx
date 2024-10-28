import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../components/SideNavbar";
import Maps from "../components/Maps";
import "../App.css";

export default function FleetDash() {
  return (
    <>
      <SideNavbar></SideNavbar>
      <Maps />
    </>
  );
}
