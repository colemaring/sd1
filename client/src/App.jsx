import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap-overrides.css"; // Custom overrides for Bootstrap
import Home from "./pages/Home";
import { WebSocketsProvider } from "./context/WebSocketsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// wrapped with WebSocketsProvider and ThemeProvider context so we can access the messages anywhere
function App() {
  return (
    <ThemeProvider>
      <WebSocketsProvider>
        <Home></Home>
      </WebSocketsProvider>
    </ThemeProvider>
  );
}

export default React.memo(App); // memo helps with performance
