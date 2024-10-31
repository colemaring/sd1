import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";
import SideGrid from "../components/sidebar/SideGrid";

export default function DriverDash() {
  return (
    <div className="flex">
      <SideGrid />
      <div className="w-full ml-20 mr-[30px] ">
        <div className="grid grid-cols-6 grid-rows-8 gap-x-[30px] gap-y-[30px] max-h-svh ">
          <div className="col-span-6 row-span-1 col-start-1 row-start-1 h-1 ">
            <h1 className="font-bold text-4xl pt-14 ">Driver Dashboard</h1>
          </div>
          <div className="col-span-3 row-span-3 col-start-1 row-start-2 rounded-xl  ">
            {/* <HighRiskDrivers /> */}
          </div>
          <div className="col-span-2 row-span-3 col-start-4 row-start-2 overflow-hidden rounded-xl ">
            {/* <OverallRiskScore /> */}
          </div>
          <div className="col-span-1 row-span-3 col-start-6 row-start-2 border-2 ">
            Calendar
          </div>
          <div className="col-span-4 row-span-3 col-start-1 row-start-5 bg-slate-100 rounded-xl">
            5
          </div>
          <div className="col-span-2 row-span-3 col-start-5 row-start-5 border-2 ">
            6
          </div>
          <div className="col-span-6 row-span-1 col-start-1 row-start-7 "></div>
        </div>
      </div>
    </div>
  );
}
