import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PiHouseFill } from "react-icons/pi";
import HighRiskDrivers from "../components/fleetdash components/HighRiskDrivers";
import OverallRiskScore from "../components/fleetdash components/OverallRiskScore";
import Notifications from "../components/fleetdash components/Notifications";
import ScoreOverview from "../components/fleetdash components/ScoreOverview";
import AllStats from "../components/fleetdash components/AllStats";
import NavBar from "../components/NavBar";

// TODO
// Implement dark/light toggle (store the state in localstorage for subsequent visits) <- also needs its own context to be accessed by all components, similar to what I'm donig with websockets context
// remove space below navbar
// api calls to populate data on page load (useeffect hook)

export default function Home() {
  return (
    <>
      <div className="flex">
        <div className="w-full ">
          <div className="grid grid-cols-12 auto-rows-[100px] h-screen gap-x-5 gap-y-6">
            <div className="col-span-12 row-span-1 row-start-1 col-start-1 w-screen ">
              <div className="pt-0">
                <NavBar />
              </div>
            </div>
            <div className="col-span-12 col-start-1 row-span-2 row-start-2 ">
              <HighRiskDrivers />
            </div>
            <div className="col-span-3 col-start-1 row-span-6 row-start-4 ml-6">
              <Notifications />
            </div>
            <div className="col-span-9 col-start-4 row-span-6 row-start-4  mr-6 rounded-xl">
              <AllStats />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
