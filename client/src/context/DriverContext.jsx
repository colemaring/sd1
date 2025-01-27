import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";

const DriverContext = createContext();

const fetchDrivers = async () => {
  const response = await fetch("http://localhost:5000/api/v1/driver");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json(); // returns the parsed JSON data
};

// Create the provider component
export const DriverProvider = ({ children }) => {
  const { data, isLoading, error } = useQuery("drivers", fetchDrivers); // simplified queryKey
  console.log(data);

  return (
    <DriverContext.Provider value={{ data, isLoading, error }}>
      {children}
    </DriverContext.Provider>
  );
};

// Custom hook to use the DriverContext
export const useDrivers = () => useContext(DriverContext);
