import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../components/SideNavbar";

export default function FleetDash() {
  return (
    <>
      <SideNavbar></SideNavbar>
      <div className="float-end h1">FleetDash</div>
    </>
  );
}
