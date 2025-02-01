import React, { useEffect, useState, useContext } from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useParams } from "react-router-dom";
import truck from "../assets/truck.png";
import { DriversContext } from "../context/DriversContext";

const DriverInfo = () => {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const drivers = useContext(DriversContext);
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    const driver = drivers.find((d) => d.phone_number === driverPhone);
    setDriverData(driver);
  }, [driverPhone]);

  if (!driverData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-row items-center rounded-xl w-full p-6 bg-chart-4 text-card-foreground shadow border">
      {/* Left: Avatar + Risk Score */}
      <div className="flex flex-col items-center w-1/5 pr-4">
        {/* Avatar Placeholder */}
        <div className="rounded-full bg-muted w-20 h-20 overflow-hidden flex items-center justify-center"></div>
        <div className="pt-4 text-center mb-1">
          <h1 className="text-3xl font-bold">
            {driverData.risk_score || "N/A"}
          </h1>
          <h2 className="text-sm">Risk Score</h2>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l h-40 border-muted"></div>

      {/* Middle: Driver Name & Phone */}
      <div className="flex flex-col w-3/5 pl-4">
        <span className="text-sm text-primary">Selected Driver</span>
        <h1 className="text-3xl font-bold mb-12">{driverData.name}</h1>

        <h1 className="text-xl font-semibold">{driverData.phone_number}</h1>
        <h2 className="text-sm text-primary">Contact Information</h2>
      </div>

      {/* Right: Activity + Truck */}
      <div className="relative w-1/5 flex items-end justify-end">
        {/* “Active” Status Ping (top-right) */}
        {driverData.active ? (
          <>
            <span className="absolute top-0 right-0 rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
            <span className="absolute top-0 right-0 rounded-full bg-green-700 w-6 h-6"></span>
          </>
        ) : (
          <span className="absolute top-0 right-0 rounded-full bg-red-500 w-6 h-6"></span>
        )}

        {/* Truck image (bottom-right) */}
        <img src={truck} alt="Truck" className="mt-20" />
      </div>
    </div>
  );
};

export default DriverInfo;
