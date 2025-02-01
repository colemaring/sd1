import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";
import ScoreCard from "../components/ScoreCard";
import { DriversContext } from "../context/DriversContext"; // Import DriversContext

function FleetDash() {
  const drivers = useContext(DriversContext);
  const [activeRisk, setActiveRisk] = useState("low");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [update, setUpdate] = useState(false);
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  useEffect(() => {
    const getRiskLevel = (score) => {
      if (score > 80) return "low";
      if (score > 60) return "medium";
      return "high";
    };

    const filtered = drivers.filter((driver) => {
      const riskLevel = getRiskLevel(driver.risk_score);
      const isActive = selectedFilters.includes("Active")
        ? driver.active
        : true;
      const isIncreasing = selectedFilters.includes("Increasing")
        ? driver.change > 0
        : true;
      const isDecreasing = selectedFilters.includes("Decreasing")
        ? driver.change < 0
        : true;

      return (
        riskLevel === activeRisk && isActive && (isIncreasing || isDecreasing)
      );
    });

    setFilteredDrivers(filtered);
  }, [update, drivers]);

  return (
    <div className="flex min-h-screen bg-primary">
      <div className="w-full">
        <div className="grid grid-cols-12 auto-rows-min items-start">
          <div className="col-span-12 border">
            <NavBar />
          </div>
          <div className="col-span-12">
            <Filter
              setActiveRisk={setActiveRisk}
              setSelectedFilters={setSelectedFilters}
              setUpdate={setUpdate}
              update={update}
              activeRisk={activeRisk}
              selectedFilters={selectedFilters}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredDrivers.map((driver) => (
                <ScoreCard
                  className="bg-card border shadow"
                  key={driver.id}
                  name={driver.name}
                  phone={driver.phone_number}
                  score={driver.risk_score}
                  change={driver.change}
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
