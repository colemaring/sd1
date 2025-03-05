import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";
import ScoreCard from "../components/ScoreCard";
import { DriversContext } from "../context/DriversContext"; // Import DriversContext

function FleetDash() {
  const { drivers, isLoading } = useContext(DriversContext);
  const [activeRisk, setActiveRisk] = useState(null); // Start with null to show all risk levels
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

      // Apply selected filters
      const isActive = selectedFilters.includes("Active")
        ? driver.active
        : true;
      
      const isIncreasing = selectedFilters.includes("Increasing") && driver.percent_change > 0;
      const isDecreasing = selectedFilters.includes("Decreasing") && driver.percent_change < 0;
      
      // Only apply the condition if at least one of the filters is selected
      const matchesChangeFilter =
        (!selectedFilters.includes("Increasing") && !selectedFilters.includes("Decreasing")) ||
        isIncreasing || isDecreasing;
      
      // Show all risk levels if activeRisk is null, otherwise filter by the specific risk level
      const matchesRiskLevel = activeRisk === null || riskLevel === activeRisk;

      return matchesRiskLevel && isActive && matchesChangeFilter;
    });

    setFilteredDrivers(filtered);
  }, [update, drivers, activeRisk, selectedFilters]);

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

              {filteredDrivers.length === 0 && !isLoading && (
                <div className="col-span-full text-center p-8 text-muted-foreground">
                  No drivers match the selected filters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetDash;
