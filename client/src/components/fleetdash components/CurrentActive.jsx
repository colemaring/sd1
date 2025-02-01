import React, { useEffect, useState, useContext } from "react";
import truck from "../../assets/truck.png";
import { useTheme } from "../../context/ThemeContext";
import { DriversContext } from "../../context/DriversContext";

function CurrentActive() {
  const [activeCount, setActiveCount] = useState(0);
  const { theme } = useTheme();
  const drivers = useContext(DriversContext);

  useEffect(() => {
    const activeDrivers = drivers.filter((driver) => driver.active).length;
    setActiveCount(activeDrivers);
  }, [drivers]);

  return (
    <div className="ml-5 mr-2 flex justify-center">
      <div className="relative flex rounded-xl w-72 p-4 h-[210px] shadow overflow-hidden text-foreground bg-card border">
        <div className="z-10">
          <h1 className="text-xl font-semibold">Active vehicles</h1>
          <h2 className="font-light">Vehicles operating on the road</h2>
          <h3 className="font-bold text-4xl pt-6">{activeCount}</h3>
        </div>
        <div className="absolute z-0 left-20 top-14">
          <img src={truck} alt="Truck" />
        </div>
      </div>
    </div>
  );
}

export default CurrentActive;
