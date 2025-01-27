import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import DriverDash from "./pages/DriverDash.jsx";
import WebSocketsTest from "./pages/WebSocketsTest.jsx";
import { WebSocketsProvider } from "./context/WebSocketsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import FleetDash from "./pages/FleetDash.jsx";
import { DriverProvider } from "./context/DriverContext.jsx";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <QueryClientProvider client={client}>
      <WebSocketsProvider>
        <DriverProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/fleet" element={<FleetDash />} />
              <Route path="/driver/:driverPhone" element={<DriverDash />} />
              <Route path="/wstest" element={<WebSocketsTest />} />
            </Routes>
          </BrowserRouter>
        </DriverProvider>
      </WebSocketsProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
