import React, { useState, useContext } from "react";
import { DriversContext } from "../../context/DriversContext";
import ScoreCard from "../ScoreCard"; // Import ScoreCard component

function HighRiskDrivers() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const drivers = useContext(DriversContext);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Filter drivers to show only active and high risk drivers
  const filteredDrivers = drivers.filter(
    (driver) => driver.active || driver.risk_score <= 60
  );

  return (
    <div className="activeContainer rounded-xl shadow flex items-center bg-card justify-center border">
      {filteredDrivers.length === 0 ? (
        <div className="flex justify-center items-center h-full ">
          <h2 className="text-lg font-semibold">
            Active or High Risk Drivers will be displayed here.
          </h2>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-center w-full">
          {filteredDrivers.map((driver) => (
            <ScoreCard
              className="bg-card border shadow" // Adjusted styles
              key={driver.id}
              name={driver.name}
              phone={driver.phone_number}
              score={driver.risk_score}
              change={driver.change}
              active={driver.active}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HighRiskDrivers;
