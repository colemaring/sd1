import React, { createContext, useState, useEffect } from "react";

// Create the context
export const DriversContext = createContext();

// Create the provider component
export const DriversProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch drivers from the API
    const fetchDrivers = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/drivers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
    // Update status every x seconds
    const intervalId = setInterval(fetchDrivers, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DriversContext.Provider value={drivers}>
      {children}
    </DriversContext.Provider>
  );
};
