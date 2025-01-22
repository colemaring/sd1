import React from "react";
import truck from "../../assets/truck-image-homePg.webp";


// WIP - fix height and position on different viewports
function CurrentActive() {
  return (
    <div
      className="relative flex rounded-xl w-72 p-4 h-[196px] border-3 bg-white overflow-hidden"
    >
      <div className="z-10">
        <h1 className="text-xl font-semibold">Active vehicles</h1>
        <h2 className="font-light">Vehicles operating on the road</h2>
        <h3 className="font-bold text-4xl pt-6">12</h3>
      </div>
      <div className="absolute z-0 left-20 top-14">
        <img src={truck} alt="" />
      </div>
    </div>
  );
}

export default CurrentActive;
