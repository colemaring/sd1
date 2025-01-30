import React, { useEffect, useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useParams } from "react-router-dom";

const DriverInfo = () => {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/drivers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const driver = data.find((d) => d.phone_number === driverPhone);
        setDriverData(driver);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchDriverData();
    // Keep activity updated by fetching data every x seconds
    const intervalId = setInterval(fetchDriverData, 3000);

    return () => clearInterval(intervalId);
  }, [driverPhone]);

  if (!driverData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex rounded-xl w-full h-full p-4 bg-chart-4 text-card-foreground shadow border`}
    >
      <div className="flex flex-col pl-2">
        <div className="rounded-full bg-muted-foreground w-20 h-20 text-center"></div>
        <h1 className="text-3xl font-semibold mt-8">
          {driverData.risk_score || "N/A"}
        </h1>
        <h2 className="text-center">Safety Score</h2>
      </div>

      <div className="flex flex-col relative">
        <div className="pt-1 relative pl-2">
          <h3 className="text-md">Current Driver</h3>
          <h1 className="text-2xl font-semibold">{driverData.name} </h1>

          <h3 className="text-sm">Phone</h3>
        </div>
        <div>
          {driverData.active ? (
            <>
              <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
              <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
            </>
          ) : (
            <span className="absolute rounded-full bg-red-500 w-6 h-6"></span>
          )}
        </div>
        <div className="relative top-9 left-20">
          <h1 className="text-3xl font-bold">{driverData.phone_number}</h1>
          <h2 className="text-md text-center">Contact Information</h2>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
