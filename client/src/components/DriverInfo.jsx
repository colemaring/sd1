import React from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useDrivers } from "../context/DriverContext";

const DriverInfo = ({ driverPhone }) => {
  const { theme } = useTheme();
  const { data, isLoading, error } = useDrivers();

  // Check if there's an error or if data is still loading
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Find the driver with the matching phone number
  const driver = data.find((driver) => driver.phone_number === driverPhone);

  if (!driver) {
    return <div>Driver not found</div>;
  }

  return (
    <div
      className={`flex rounded-xl w-full h-full p-4 bg-card text-card-foreground`}
    >
      <div className="flex flex-col pl-2">
        <div className="rounded-full bg-muted-foreground w-20 h-20 text-center"></div>
        <h1 className="text-5xl font-semibold mt-4">
          {driver.risk_score || "N/A"}
        </h1>
        <h2 className="text-center">Risk Score</h2>
      </div>
      <div className="flex flex-col relative">
        <div className="pt-1 relative pl-2">
          <h3 className="text-md">Current Driver</h3>
          <h1 className="text-2xl font-semibold">{driver.name}</h1>
          <h3 className="text-sm">Phone</h3>
        </div>
        <div className="relative top-9 left-20">
          <h1 className="text-4xl font-bold">{driver.phone_number}</h1>
          <h2 className="text-md text-center">Contact Information</h2>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
