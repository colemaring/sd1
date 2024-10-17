import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home";
import SideNavbar from "./components/SideNavbar";
import FleetDash from "./pages/FleetDash";
import DriverDash from "./pages/DriverDash";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<SideNavbar />}>
      <Route index element={<Home />} />
      <Route path="fleet" element={<FleetDash />} />
      <Route path="driver" element={<DriverDash />} />
    </Route>
  )
);

function App({ routes }) {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default React.memo(App); // memo helps with performance
