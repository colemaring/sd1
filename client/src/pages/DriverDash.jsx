import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import SideGrid from "../components/sidebar/SideGrid";
import Notifications from "../components/fleetdash components/Notifications";
import WarningCount from "../components/WarningCount";
import DriverInfo from "../components/DriverInfo";
import { PiHouseFill } from "react-icons/pi";
import EventsLog from "../components/EventsLog";

export default function DriverDash() {
  return (
    <div className="flex">
      <SideGrid />
      <div className="w-full ml-20 mr-[30px] ">
        <div className="grid grid-cols-8 auto-rows-[100px] gap-x-[30px] gap-y-[30px] max-h-svh ">
          <div className="col-span-8 row-span-1 col-start-1 row-start-1 h-1 pt-6">
            <h3 className="text-sm text-gray-400 mr-2">
              <PiHouseFill className="inline" /> / Driver Analytics / Driver's
              Name{" "}
            </h3>
            <h1 className="font-bold text-xl ">Driver's Name</h1>
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-2 rounded-xl border-2 ">
            <DriverInfo />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-4 overflow-hidden rounded-xl border-2">
            Driver's risk score
          </div>
          <div className="col-span-2 row-span-3 col-start-1 row-start-6">
            <Notifications />
          </div>
          <div className="col-span-4 row-span-3 col-start-3 row-start-2 shadow-xl rounded-xl">
            <EventsLog />
          </div>
          <div className="col-span-2 row-span-3 col-start-7 row-start-2 bg-slate-100 rounded-xl">
            <WarningCount />
          </div>
          <div className="col-span-6 row-span-1 col-start-1 row-start-7 "></div>
        </div>
      </div>
    </div>
  );
}
