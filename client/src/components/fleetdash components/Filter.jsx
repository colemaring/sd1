import React, { useState } from "react";

// WIP - will work on proper display later this week

// Filter feature for the main page
// Has three separated columns, 1st risk filter, 2nd current selected filters, 3rd filter selection
function Filter() {
  // Set 'high' as the default active risk
  const [activeRisk, setActiveRisk] = useState("high");

  // Function to handle click and set active risk
  const handleClick = (risk) => {
    setActiveRisk(risk);
  };

  // Maybe change it to use a grid so that it is easier to organize everything

  return (
    <div className="flex flex-row w-screen border-2">
      {/* Main risk choice */}
      <div className="flex flex-row bg-[#f0f0f0] rounded-xl w-[25%] p-2 text-center justify-evenly items-center">
        <div
          onClick={() => handleClick("high")}
          className={`${
            activeRisk === "high" ? "rounded-xl bg-white font-semibold" : ""
          } p-2 text-xl cursor-pointer`}
        >
          High Risk
        </div>
        <div
          onClick={() => handleClick("medium")}
          className={`${
            activeRisk === "medium" ? "rounded-xl bg-white font-semibold" : ""
          } p-2 text-xl cursor-pointer`}
        >
          Medium Risk
        </div>
        <div
          onClick={() => handleClick("low")}
          className={`${
            activeRisk === "low" ? "rounded-xl bg-white font-semibold" : ""
          } p-2 text-xl cursor-pointer`}
        >
          Low Risk
        </div>
      </div>
      {/* Work on this later - line between cols */}
      <span className="border-2 h-14 border-black"></span>
      {/* Selected filters */}
      <div className="flex flex-row pl-2">
        <div className="bg-[#f0f0f0] rounded-xl flex justify-center items-center text-xl p-3 font-semibold">
          Active X
        </div>
        <div className="bg-[#f0f0f0] rounded-xl flex justify-center items-center text-xl p-3 font-semibold ml-2">
          Increasing X
        </div>
      </div>
      {/* Work on this later - line between cols */}
      <span className="relative border-2 h-14 border-black float-end left-32"></span>
      {/* Filter Button */}
      <div className="bg-[#f0f0f0] rounded-xl flex justify-center items-center text-xl p-3 font-semibold ml-2 relative left-32">
        Filter
      </div>
    </div>
  );
}

export default Filter;
