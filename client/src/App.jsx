import React from "react";
import Maps from "./components/Maps"; // Import the Maps component

function App() {
  console.log("im cool w not using bootstrap");
  return <Maps />;
}

export default React.memo(App); // memo helps with performance
