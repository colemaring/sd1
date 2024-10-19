import React from "react";
import Maps from "../components/Maps"; // Import the Maps component
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavbar from "../components/SideNavbar";

export default function Home() {
  return (
    <>
      <SideNavbar></SideNavbar>
      <Maps />
    </>
  );
}
