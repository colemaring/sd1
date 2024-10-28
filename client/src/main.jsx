import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import FleetMap from "./pages/FleetMap.jsx";
import DriverDash from "./pages/DriverDash.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/fleet" element={<FleetMap />} />
      <Route path="/driver" element={<DriverDash />} />
    </Routes>
  </BrowserRouter>
);
