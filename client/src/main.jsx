import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import DriverDash from "./pages/DriverDash.jsx";
import { WebSocketsProvider } from "./context/WebSocketsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import FleetDash from "./pages/FleetDash.jsx";
import { DriversProvider } from "./context/DriversContext.jsx";
import { DriverRiskEventsProvider } from "./context/DriverRiskEventsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <DriversProvider>
      <WebSocketsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/fleet" element={<FleetDash />} />
            {/* DriverRiskEventsProvider needs driverPhone */}
            <Route
              path="/driver/:driverPhone"
              element={
                <DriverRiskEventsProvider>
                  <DriverDash />
                </DriverRiskEventsProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </WebSocketsProvider>
    </DriversProvider>
  </ThemeProvider>
);
