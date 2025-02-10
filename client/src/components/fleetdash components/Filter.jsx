import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "../../bootstrap-overrides.css"; // Custom overrides

function Filter({
  setActiveRisk,
  setSelectedFilters,
  setUpdate,
  update,
  activeRisk,
  selectedFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For small screen toggle
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

  const applyFilters = () => {
    // Only close the menu on small screens
    if (!isLargeScreen) {
      setIsFilterOpen(false);
    }
    setUpdate(!update);
  };

  // Watch for screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Always open on desktop
  useEffect(() => {
    if (isLargeScreen) {
      setIsFilterOpen(true);
    }
  }, [isLargeScreen]);

  return (
    <div className="w-full">
      {/* Mobile-only button to open/close filters */}
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
                onClick={() => setActiveRisk(risk.toLowerCase())}
                className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                  activeRisk === risk.toLowerCase()
                    ? "bg-card text-card-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                }`}
              >
                {risk} Risk
              </div>
            ))}
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

          {/* Right: Apply Filters*/}
          <div className="flex-1 pl-4 flex items-center">
            <Button variant="success" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      ) : (
        //  MOBILE LAYOUT
        isFilterOpen && (
          <div
            className="flex flex-col gap-4 p-3 rounded-xl"
            style={{ backgroundColor: "hsl(var(--background))" }}
          >
            {/* Row 1: Risk Filters */}
            <div className="flex flex-wrap gap-2">
              {risks.map((risk) => (
                <div
                  key={risk}
                  onClick={() => setActiveRisk(risk.toLowerCase())}
                  className={`px-4 py-1 text-sm cursor-pointer rounded-lg ${
                    activeRisk === risk.toLowerCase()
                      ? "bg-card text-card-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground"
                  }`}
                >
                  {risk} Risk
                </div>
              ))}
            </div>

            {/* Row 2: Data Filters */}
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

            {/* Row 3: Apply Filters*/}
            <Button variant="success" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        )
      )}
    </div>
  );
}

export default Filter;
