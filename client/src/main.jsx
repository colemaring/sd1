import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import DriverDash from "./pages/DriverDash.jsx";
import WebSocketsTest from "./pages/WebSocketsTest.jsx";
import { WebSocketsProvider } from "./context/WebSocketsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import FleetDash from "./pages/FleetDash.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <WebSocketsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/fleet" element={<FleetDash />} />
          <Route path="/driver/:driverPhone" element={<DriverDash />} />
          <Route path="/wstest" element={<WebSocketsTest />} />
        </Routes>
      </BrowserRouter>
    </WebSocketsProvider>
  </ThemeProvider>
);
