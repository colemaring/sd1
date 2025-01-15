import React from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import WarningCount from "../components/WarningCount";
import DriverInfo from "../components/DriverInfo";
import EventsLog from "../components/EventsLog";
import NavBar from "../components/NavBar";
import { WebSocketsContext } from "../context/WebSocketsContext";

export default function DriverDash() {
  const { driverName } = useParams();
  const messages = useContext(WebSocketsContext);

  const driverData = messages[driverName];
  console.log(driverData);

  if (!driverData) {
    return <div>Loading...</div>;
  }

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
            <div className="col-span-5 col-start-1 row-span-2 row-start-2  ml-6 h-full">
              <DriverInfo driverData={driverData} />
            </div>
            <div className="col-span-3 col-start-6 row-span-2 row-start-2 bg-[#f0f0f0] rounded-xl"></div>
            <div className="col-span-4 col-start-9 row-span-2 row-start-2 mr-6 bg-[#f0f0f0] rounded-xl"></div>
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
