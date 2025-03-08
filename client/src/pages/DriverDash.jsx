import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css";
import "../App.css";
import WarningCount from "../components/WarningCount";
import DriverInfo from "../components/DriverInfo";
import EventsLogNew from "../components/EventsLogNew";
import NavBar from "../components/NavBar";
import RiskHistoryGraph from "../components/fleetdash components/RiskHistoryGraph";
import AISummary from "../components/fleetdash components/AISummary";
import { DriverRiskEventsContext } from "../context/DriverRiskEventsContext";

export default function DriverDash() {
  const { riskEvents, updateRiskEvents } = useContext(DriverRiskEventsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRiskEvents();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateRiskEvents]);

  return (
    <>
      <div className="flex bg-background min-h-screen">
        <div className="w-full">
          <div className="grid grid-cols-12 auto-rows-min items-start">
            {/* Navbar */}
            <div className="col-span-12 border">
              <NavBar />
            </div>
            {/* Driver Info */}
            <div className="col-span-12 md:col-span-6 lg:col-span-5 p-4">
              <DriverInfo />
            </div>
            <RiskHistoryGraph riskEvents={riskEvents} />
            <AISummary />
            {/* Warning Count */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 p-4 ">
              <WarningCount riskEvents={riskEvents} />
            </div>
            {/* Events Log */}
            <div className="col-span-12 md:col-span-6 lg:col-span-9 p-4">
              <EventsLogNew riskEvents={riskEvents} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
