import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import "../App.css";
import WarningCount from "../components/WarningCount";
import DriverInfo from "../components/DriverInfo";
import EventsLog from "../components/EventsLog";
import NavBar from "../components/NavBar";
import { WebSocketsContext } from "../context/WebSocketsContext";
import DashFilters from "../components/fleetdash components/DashFilters";
import AISummary from "../components/fleetdash components/AISummary";

export default function DriverDash() {
  const { driverPhone } = useParams();
  const messages = useContext(WebSocketsContext);
  const [driverData, setDriverData] = useState({});
  const [tripsRange, setTripsRange] = useState(); // To be used for conditional rendering
  const [eventTypes, setEventTypes] = useState();

  useEffect(() => {
    setDriverData(messages[driverPhone] || {});
  }, [driverPhone, messages]);

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

            <AISummary driverData={driverData} />
            <DashFilters />

            {/* Warning Count */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 p-4">
              <WarningCount driverData={driverData} />
            </div>
            {/* Events Log */}
            <div className="col-span-12 md:col-span-6 lg:col-span-9 p-4">
              <EventsLog driverData={driverData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
