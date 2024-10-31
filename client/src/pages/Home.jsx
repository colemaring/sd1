import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PiHouseFill } from "react-icons/pi";
import HighRiskDrivers from "../components/fleetdash components/HighRiskDrivers";
import OverallRiskScore from "../components/fleetdash components/OverallRiskScore";
import SideGrid from "../components/sidebar/SideGrid";
import Notifications from "../components/fleetdash components/Notifications";
import ScoreOverview from "../components/fleetdash components/ScoreOverview";
import AllStats from "../components/fleetdash components/AllStats";

export default function Home() {
  return (
    <>
      <div className="flex">
        <SideGrid />
        <div className="w-full ml-20 mr-[30px]">
          <div className="grid grid-cols-8 grid-rows-8 h-screen gap-3 gap-y-5">
            <div className="col-span-8">
              <h1 className="font-bold text-4xl pt-14 ">Fleet Dashboard</h1>
            </div>
            <div className="col-span-3 row-span-2 row-start-2 w-full">
              <HighRiskDrivers />
            </div>
            <div className="col-span-2 row-span-2 col-start-5 row-start-">
              <OverallRiskScore />
            </div>
            <div className="col-span-2 row-span-2 col-start-7 row-start-2 h-[320px]">
              <ScoreOverview />
            </div>
            <div className="col-span-3 row-span-2 row-start-5">
              <Notifications />
            </div>
            <div className="col-span-5 row-span-2 col-start-4 row-start-5 h-[400px]  p-4 rounded-xl">
              <AllStats />
            </div>
            <div className="col-span-8 row-span-1 row-start-8"></div>
          </div>
        </div>
      </div>
    </>
  );
}
