import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { WebSocketsProvider } from "./context/WebSocketsContext.jsx";

// wrapped with WebSocketsProvider context so we can access the messages anywhere
function App() {
  return (
    <WebSocketsProvider>
      <Home></Home>
    </WebSocketsProvider>
  );
}

export default React.memo(App); // memo helps with performance
