import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap-overrides.css"; // Custom overrides for Bootstrap
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";

// wrapped with WebSocketsProvider and ThemeProvider context so we can access the messages anywhere
function App() {
  return (
    <ThemeProvider>
      <div className="bg-muted min-h-screen">
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default React.memo(App); // memo helps with performance
