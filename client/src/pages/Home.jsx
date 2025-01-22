import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import { PiHouseFill } from "react-icons/pi";
import HighRiskDrivers from "../components/fleetdash components/HighRiskDrivers";
import OverallRiskScore from "../components/fleetdash components/OverallRiskScore";
import Notifications from "../components/fleetdash components/Notifications";
import ScoreOverview from "../components/fleetdash components/ScoreOverview";
import AllStats from "../components/fleetdash components/AllStats";
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";

// TODO
// Implement dark/light toggle (store the state in localstorage for subsequent visits) <- also needs its own context to be accessed by all components, similar to what I'm doing with websockets context
// api calls to populate data on page load (useEffect hook)

export default function Home() {
  return (
    <>
      <div className="flex bg-secondary">
        <div className="w-full ">
          <div className="grid grid-cols-12 auto-rows-min gap-x-5 gap-y-6">
            {/* Nav Bar - takes 1 row of space */}
            <div className="col-span-12 row-start-1 p-0">
              <NavBar />
            </div>
            {/* Filter Component */}
            <div className="col-span-12 row-start-2 p-0">
              <Filter />
            </div>
            {/* 3 drivers display - takes 2 rows of span */}
            {/* Will change col span later to fit current online drivers display */}
            <div className="col-span-12 row-span-2 row-start-3">
              <HighRiskDrivers />
            </div>
            {/* Start of "fourth" row */}
            {/* Most recent notification display */}
            <div className="col-span-3 row-span-6 row-start-5 ml-6">
              <Notifications />
            </div>
            {/* Chart Prototype - WIP */}
            <div className="col-span-9 row-span-6 row-start-5 mr-6 rounded-xl">
              <AllStats />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
