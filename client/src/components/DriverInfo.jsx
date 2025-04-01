import React, { useEffect, useState, useContext } from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useParams } from "react-router-dom";
import { DriversContext } from "../context/DriversContext";

const DriverInfo = () => {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const { drivers, isLoading } = useContext(DriversContext);
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      const driver = drivers.find((d) => d.phone_number === driverPhone);
      setDriverData(driver);
    }
  }, [driverPhone, drivers]);

  // Loading skeleton
  if (!drivers || drivers.length === 0) {
    return (
      <div className="h-[213px] w-full animate-pulse bg-gray-300 border rounded-xl"></div>
    );
  }

  if (!driverData) {
    return <div>Driver not found</div>;
  }

  return (
    <div className="bg-card relative flex flex-row items-center rounded-xl w-full p-6 text-card-foreground shadow border bg1 bg-top bg-contain ">
      {/* Left: Avatar + Risk Score */}
      <div className="flex flex-col items-center w-2/5 pr-4">
        {/* Avatar Placeholder */}
        <div className="rounded-full bg-muted w-20 h-20 overflow-hidden flex items-center justify-center">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${driverData.name}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="pt-4 text-center w-100 mb-1">
          <h1 className="text-3xl font-bold">
            {driverData.risk_score || "N/A"}
          </h1>

          <h2 className="text-sm">Safety Score</h2>
          {driverData.percent_change != null ? (
            <span
              className={`font-bold ${
                driverData.percent_change > 0
                  ? "text-green-500"
                  : driverData.percent_change < 0
                  ? "text-red-500"
                  : ""
              }`}
            >
              {driverData.percent_change >= 0
                ? `+${driverData.percent_change}%`
                : `${driverData.percent_change}%`}
            </span>
          ) : (
            <span className="font-bold">+0%</span>
          )}

          <div className="flex items-center w-full">
            <span className="text-xs text-muted-foreground">Unsafe</span>

            <div className="relative flex-grow mx-2 bg-gray-300 rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  driverData.risk_score > 80
                    ? "bg-green-500"
                    : driverData.risk_score > 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${driverData.risk_score}%` }}
              ></div>
            </div>

            <span className="text-xs text-muted-foreground">Safe</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l h-40 border-muted"></div>

      {/* Middle: Driver Name & Phone */}
      <div className="flex flex-col w-3/5 pl-4">
        <span className="text-sm text-primary">Selected Driver</span>
        <h1 className="text-3xl font-bold mb-12">{driverData.name}</h1>

        <h1 className="text-xl font-semibold">
          {" "}
          {driverData.phone_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "($1) $2-$3"
          )}
        </h1>
        <h2 className="text-sm text-primary">Contact Information</h2>
      </div>

      {/* Right: Activity + Truck */}
      <div className="relative w-1/5 flex items-end justify-end">
        {/* “Active” Status Ping (top-right) */}
        {driverData.active ? (
          <>
            <span className="absolute top-14 right-0 rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
            <span className="absolute top-14 right-0 rounded-full bg-green-700 w-6 h-6"></span>
          </>
        ) : (
          <span className="absolute top-14 right-0 rounded-full bg-red-500 w-6 h-6"></span>
        )}

        {/* Truck image (bottom-right) */}
        {/* <img src={truck} alt="Truck" className="h-max" /> */}
      </div>
    </div>
  );
};

export default DriverInfo;
