import React from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bootstrap-overrides.css"; // Custom overrides
import "../App.css";
import WarningCount from "../components/WarningCount";
import DriverInfo from "../components/DriverInfo";
import EventsLog from "../components/EventsLog";
import NavBar from "../components/NavBar";
import { WebSocketsContext } from "../context/WebSocketsContext";

// TODO
// add a useeffect hook and call api to grab users info like phone, risk score, etc
// also an api call to populate event log & warning count with previous events stored in db, then websockets will handle the addition of new events, also streaming them to the db for future calls
// maybe add some sort of filter to only show the events from the last week or so?
// fix warning count going off screen and align the countainers
// remove large white space below navbar, remove overflow-y IMO

export default function DriverDash() {
  const { driverName } = useParams();
  const messages = useContext(WebSocketsContext);

  const driverData = messages[driverName] || {}; // Provide default empty object if driverData is not available

  return (
    <>
      <div className="flex bg-muted">
        <div className="w-full ">
          <div className="grid grid-cols-12 auto-rows-[100px] h-screen gap-x-5 gap-y-6">
            <div className="col-span-12 row-span-1 row-start-1 col-start-1 w-screen ">
              <div className="pt-0">
                <NavBar />
              </div>
            </div>
            <div className="col-span-5 col-start-1 row-span-2 row-start-2 ml-6 h-full">
              <DriverInfo driverData={driverData} />
            </div>
            <div className="col-span-3 col-start-6 row-span-2 row-start-2 bg-card rounded-xl"></div>
            <div className="col-span-4 col-start-9 row-span-2 row-start-2 mr-6 bg-card rounded-xl"></div>
            <div className="col-span-3 col-start-1 row-span-4 row-start-4 ml-6 overflow-hidden rounded-xl">
              <WarningCount driverData={driverData} />
            </div>
            <div className="col-span-9 col-start-4 row-span-4 row-start-4 mr-6 rounded-xl">
              <EventsLog driverData={driverData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
