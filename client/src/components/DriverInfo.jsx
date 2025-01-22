import React from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";

const DriverInfo = ({ driverData }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex rounded-xl w-full h-full p-4 bg-card text-card-foreground`}
    >
      <div className="flex flex-col pl-2">
        <div className="rounded-full bg-muted-foreground w-20 h-20 text-center"></div>
        <h1 className="text-5xl font-semibold mt-4">
          {driverData.RiskScore || "N/A"}
        </h1>
        <h2 className="text-center">Risk Score</h2>
      </div>
      <div className="flex flex-col relative">
        <div className="pt-1 relative pl-2">
          <h3 className="text-md">Current Driver</h3>
          <h1 className="text-2xl font-semibold">{driverData.Driver}</h1>
          <h3 className="text-sm">Phone</h3>
        </div>
        <div className="relative top-9 left-20">
          <h1 className="text-4xl font-bold">(123) 123-1234</h1>
          <h2 className="text-md text-center">Contact Information</h2>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
