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

export default function DriverDash() {
  const { driverPhone } = useParams();
  const messages = useContext(WebSocketsContext);
  //console.log(messages[driverPhone]);
  const [driverData, setDriverData] = useState({});

  useEffect(() => {
    setDriverData(messages[driverPhone] || {});
    //console.log("Driver Phone: ", driverPhone);
  }, [driverPhone, messages]);

  return (
    <>
      <div className="flex bg-muted min-h-screen">
        <div className="w-full">
          <div className="grid grid-cols-12 auto-rows-min items-start">
            {/* Navbar */}
            <div className="col-span-12 border">
              <NavBar />
            </div>

            {/* Driver Info */}
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <DriverInfo />
            </div>

            {/* Empty Placeholder 1 */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-card rounded-xl h-full"></div>

            {/* Empty Placeholder 2 */}
            <div className="col-span-12 lg:col-span-4 bg-card rounded-xl h-full"></div>

            {/* Warning Count */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <WarningCount driverData={driverData} />
            </div>
            {/* Events Log */}
            <div className="col-span-12 md:col-span-6 lg:col-span-9">
              <EventsLog driverData={driverData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
