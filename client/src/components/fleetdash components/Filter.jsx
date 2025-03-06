import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../bootstrap-overrides.css";
import { Button } from "react-bootstrap";

function Filter({
  setActiveRisk,
  setSelectedFilters,
  setUpdate,
  update,
  activeRisk,
  selectedFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const risks = ["High", "Medium", "Low"];
  const filters = ["Active", "Increasing", "Decreasing"];

  const toggleFilterOpen = () => setIsFilterOpen(!isFilterOpen);

  const toggleSelectedFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const handleRiskSelection = (risk) => {
    if (activeRisk === risk.toLowerCase()) {
      setActiveRisk(null);
    } else {
      setActiveRisk(risk.toLowerCase());
    }
  };

  // Left this in case you still need to trigger something on updates
  // const applyFilters = () => {
  //   if (!isLargeScreen) {
  //     setIsFilterOpen(false);
  //   }
  //   setUpdate(!update);
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setIsFilterOpen(true);
    }
  }, [isLargeScreen]);

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <div className="flex justify-between items-center md:hidden p-2">
        <h1 className="font-bold text-primary text-lg">Filters</h1>
        <button
          className="flex items-center px-3 py-2 rounded"
          style={{
            backgroundColor: `hsl(var(--primary))`,
            color: `hsl(var(--primary-foreground))`,
          }}
          onClick={toggleFilterOpen}
        >
          <IoFilter className="mr-2" size={18} />
          <span>{isFilterOpen ? "Close" : "Open"}</span>
        </button>
      </div>

      {/* DESKTOP LAYOUT */}
      {isLargeScreen ? (
        <div
          className="
            hidden md:flex 
            w-full px-4 py-3 
            rounded-xl 
            divide-x divide-border
          "
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          {/* Left: Risk Filters */}
          <div className="flex-1 pr-4 flex flex-wrap items-center gap-2">
            {risks.map((risk) => (
              <div
                key={risk}
                onClick={() => handleRiskSelection(risk)}
                className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                  activeRisk === risk.toLowerCase()
                    ? "bg-card text-card-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                }`}
              >
                {risk} Risk
              </div>
            ))}
            {activeRisk === null && (
              <span className="text-xs text-muted-foreground ml-2">
                (Showing all risk levels)
              </span>
            )}
          </div>

          {/* Center: Data Filters */}
          <div className="flex-1 px-4 flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <div
                key={filter}
                onClick={() => toggleSelectedFilter(filter)}
                className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                  selectedFilters.includes(filter)
                    ? "bg-card text-card-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                }`}
              >
                {filter}
              </div>
            ))}
          </div>

          <div className="flex-1 pl-4 flex items-center" />
        </div>
      ) : (
        // MOBILE LAYOUT
        isFilterOpen && (
          <div
            className="flex flex-col gap-4 p-3 rounded-xl"
            style={{ backgroundColor: "hsl(var(--background))" }}
          >
            <div className="flex flex-wrap gap-2">
              {risks.map((risk) => (
                <div
                  key={risk}
                  onClick={() => handleRiskSelection(risk)}
                  className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                    activeRisk === risk.toLowerCase()
                      ? "bg-card text-card-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                  }`}
                >
                  {risk} Risk
                </div>
              ))}
              {activeRisk === null && (
                <span className="text-xs text-muted-foreground ml-1 mt-1">
                  (Showing all risk levels)
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <div
                  key={filter}
                  onClick={() => toggleSelectedFilter(filter)}
                  className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                    selectedFilters.includes(filter)
                      ? "bg-card text-card-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                  }`}
                >
                  {filter}
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Filter;
