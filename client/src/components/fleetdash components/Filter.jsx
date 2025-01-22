import React, { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../bootstrap-overrides.css"; // Custom overrides

function Filter() {
  const [activeRisk, setActiveRisk] = useState("high");
  const [selectedFilters, setSelectedFilters] = useState(["Active", "Increasing"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For small screen toggle
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  const risks = ["High", "Medium", "Low"];
  const filters = ["Active", "Increasing", "Decreasing"];

  const toggleFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSelectedFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const applyFilters = () => {
    if (!isLargeScreen) {
      setIsFilterOpen(false); // Close the filter menu on small screens
    }
  };

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
    <div className="w-full border-t border-b" style={{ borderColor: "hsl(var(--border))" }}>
      {/* Compact Filter Button for Small Screens */}
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

      {/* Full Filter Layout */}
      {(isFilterOpen || isLargeScreen) && (
        <div
          className="flex flex-wrap items-center gap-4 p-3 rounded-xl border"
          style={{
            backgroundColor: "hsl(var(--muted))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {/* Risk Selection */}
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

          {/* Divider */}
          <span
            className="border-l h-6"
            style={{
              borderColor: "hsl(var(--foreground))",
            }}
          ></span>

          {/* Filters */}
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

          {/* Divider */}
          <span
            className="border-l h-6"
            style={{
              borderColor: "hsl(var(--foreground))",
            }}
          ></span>

          {/* Apply Filters Button */}
          <button
            className="px-3 py-2 rounded"
            style={{
              backgroundColor: `hsl(var(--primary))`,
              color: `hsl(var(--primary-foreground))`,
            }}
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Filter;
