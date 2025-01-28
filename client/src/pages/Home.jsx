import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import NavBar from "../components/NavBar";
import Filter from "../components/fleetdash components/Filter";
import HighRiskDrivers from "../components/fleetdash components/HighRiskDrivers";
import Notifications from "../components/fleetdash components/Notifications";
import AllStats from "../components/fleetdash components/AllStats";
import CurrentActive from "../components/fleetdash components/CurrentActive";

// TODO: Add API calls for data

export default function Home() {
  return (
    <div className="flex bg-secondary min-h-screen">
      <div className="w-full">
        <div className="grid grid-cols-12 gap-x-4 gap-y-6 auto-rows-min">
          {/* Nav Bar */}
          <div className="col-span-12">
            <NavBar />
          </div>

          {/* Filter */}
          <div className="col-span-12">
            <Filter />
          </div>

          {/* High Risk Drivers and Current Active in the same row */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 ">
            <HighRiskDrivers />
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="">
              <CurrentActive />
            </div>
          </div>

          {/* Notifications and Stats/Chart */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="p-4">
              <Notifications />
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="p-4">
              <AllStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
