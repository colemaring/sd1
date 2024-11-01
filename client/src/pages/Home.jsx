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
        <div className="w-full ml-20 mr-[30px] ">
          <div className="grid grid-cols-10 auto-rows-[100px] h-screen gap-x-5 gap-y-6">
            <div className="col-span-10">
              <div className="pt-4">
                <h3 className="text-sm text-gray-400 mr-2"><PiHouseFill className="inline"/> / Dashboard </h3>
                <h1 className="font-bold text-2xl ">Fleet Dashboard</h1>
              </div>
            </div>
            <div className="col-span-5 row-span-3 row-start-2 w-full ">
              <HighRiskDrivers />
            </div>
            <div className="col-span-2 row-span-3 col-start-6 row-start-2">
              <OverallRiskScore />
            </div>
            <div className="col-span-3 row-span-3 col-start-8 row-start-">
              <ScoreOverview />
            </div>
            <div className="col-span-3 row-span-2 row-start-5">
              <Notifications />
            </div>
            <div className="col-span-7 row-span-2 col-start-4 row-start-5">
              <AllStats />
            </div>
            <div className="col-span-8 row-span-1 row-start-8"></div>
          </div>
        </div>
      </div>
    </>
  );
}
