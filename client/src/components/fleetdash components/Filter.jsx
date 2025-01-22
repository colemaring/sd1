import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../bootstrap-overrides.css"; // Custom overrides
import { useTheme } from "../../context/ThemeContext";

function Filter() {
  const [activeRisk, setActiveRisk] = useState("high");

  const handleClick = (risk) => {
    setActiveRisk(risk);
  };

  return (
    <div className="flex flex-row w-full border-2 border-border text-foreground">
      {/* Main risk choice */}
      <div className="flex flex-row bg-muted rounded-xl w-[25%] p-2 text-center justify-evenly items-center">
        {["high", "medium", "low"].map((risk) => (
          <div
            key={risk}
            onClick={() => handleClick(risk)}
            className={`p-2 text-xl cursor-pointer ${
              activeRisk === risk ? "rounded-xl bg-card font-semibold" : ""
            }`}
          >
            {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
          </div>
        ))}
      </div>
      {/* Line between columns */}
      <span className="border-2 h-14 border-border bg-primary"></span>
      {/* Selected filters */}
      <div className="flex flex-row pl-2 bg-primary">
        {["Active X", "Increasing X"].map((filter) => (
          <div
            key={filter}
            className="bg-primary rounded-xl flex justify-center items-center text-xl p-3 font-semibold ml-2"
          >
            {filter}
          </div>
        ))}
      </div>
      {/* Line between columns */}
      <span className="relative border-2 h-14 border-border float-end left-32"></span>
      {/* Filter Button */}
      <div className="bg-primary rounded-xl flex justify-center items-center text-xl p-3 font-semibold ml-2 relative left-32">
        Filter
      </div>
    </div>
  );
}

export default Filter;
