import React from "react";
import truck from "../../assets/truck.png";
import { useTheme } from "../../context/ThemeContext";
import { useDrivers } from "../../context/DriverContext";

// WIP - fix height and position on different viewports
function CurrentActive() {
  const { theme } = useTheme();
  const { data: drivers, isLoading, error } = useDrivers();

  if (isLoading) {
    return (
      <div
        className={`relative flex rounded-xl w-72 p-4 h-[196px] shadow-md overflow-hidden ${
          theme === "dark" ? "bg-card text-white" : "bg-white text-black"
        }`}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`relative flex rounded-xl w-72 p-4 h-[196px] shadow-md overflow-hidden ${
          theme === "dark" ? "bg-card text-white" : "bg-white text-black"
        }`}
      >
        <h1>Error fetching drivers</h1>
      </div>
    );
  }

  // Calculate active drivers count
  const activeCount = drivers
    ? drivers.filter((driver) => driver.active).length
    : 0;

  return (
    <div
      className={`relative flex rounded-xl w-72 p-4 h-[196px] shadow-md overflow-hidden ${
        theme === "dark" ? "bg-card text-white" : "bg-white text-black"
      }`}
    >
      <div className="z-10">
        <h1 className="text-xl font-semibold">Active vehicles</h1>
        <h2 className="font-light">Vehicles operating on the road</h2>
        <h3 className="font-bold text-4xl pt-6">{activeCount}</h3>
      </div>
      <div className="absolute z-0 left-20 top-14">
        <img src={truck} alt="Truck" />
      </div>
    </div>
  );
}

export default CurrentActive;
