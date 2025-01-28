import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";
import ScoreCard from "../components/ScoreCard";
import { WebSocketsContext } from "../context/WebSocketsContext";
import { useContext } from "react";

function FleetDash() {
  const [drivers, setDrivers] = useState([]);
  const messages = useContext(WebSocketsContext);

  useEffect(() => {
    // Fetch drivers from the API
    const fetchDrivers = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/drivers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        //console.log(data);
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
    <div className="flex min-h-screen bg-primary">
      <div className="w-full">
        <div className="grid grid-cols-12 auto-rows-min items-start">
          <div className="col-span-12 border">
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
