import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Home></Home>
    </>
  );
}

export default React.memo(App); // memo helps with performance
