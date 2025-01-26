import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";
import ScoreCard from "../components/ScoreCard";

function FleetDash() {
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
        console.log(data);
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="flex min-h-screen ">
      <div className="w-full">
        <div className="grid grid-cols-12 auto-rows-min">
          <div className="col-span-12">
            <NavBar />
          </div>
          <div className="col-span-12">
            {/* Filter - WIP */}
            <Filter />
          </div>
          <div className="col-span-12">
            {/* Driver cards in rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
              {drivers.map((driver) => (
                <ScoreCard
                  key={driver.id}
                  name={driver.name}
                  phone={driver.phone_number}
                  score={driver.risk_score}
                  change={"% change"}
                  active={driver.active}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetDash;
