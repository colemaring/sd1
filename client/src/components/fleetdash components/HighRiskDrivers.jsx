import React, { useState, useContext } from "react";
import { DriversContext } from "../../context/DriversContext";
import ScoreCard from "../ScoreCard"; // Import ScoreCard component

function HighRiskDrivers() {
  const { drivers, isLoading } = useContext(DriversContext);

  // testing for display
  // const drivers = [
  //   { name: "John Doe", phone_number: "1233133227", risk_score: 67, change: "-1.8%", active: true, id:1 },
  //   { name: "Alice Smith", phone_number: "1239876543", risk_score: 45, change: "-2.5%", active: true, id:2 },
  //   { name: "Bob Johnson", phone_number: "1121112222", risk_score: 52, change: "+1.4%", active: true, id:3},
  // ];

  // Filter drivers to show only active and high risk drivers
  const filteredDrivers = drivers.filter(
    (driver) => driver.active || driver.risk_score <= 60
  );

  return (
    <div className=" p-4 rounded-xl shadow flex items-center bg-card justify-center border h-[213px]">
      {filteredDrivers.length === 0 ? (
        <div className="flex justify-center items-center h-full ">
          <h2 className="text-lg font-semibold">
            Active or High Risk Drivers will be displayed here.
          </h2>
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center">
          {filteredDrivers.map((driver) => (
            <ScoreCard
              style={
                "relative cardBorder flex rounded-xl w-full ml-2 lg:h-[200px] p-4 bg-card text-foreground shadow-md cursor-pointer border transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              }
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
