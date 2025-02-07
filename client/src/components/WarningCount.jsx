import React, { useEffect, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import { useParams } from "react-router-dom";
const WarningCount = ({ driverData }) => {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const [selectedFilter, setSelectedFilter] = useState("7 Day");
  const [warningCounts, setWarningCounts] = useState({
    Drinking: 0,
    Eating: 0,
    OnPhone: 0,
    SeatbeltOff: 0,
    Sleeping: 0,
    Smoking: 0,
    OutOfLane: 0,
    RiskyDrivers: 0,
    UnsafeDistance: 0,
    HandsOnWheel: 0,
  });

  const warnings = [
    { label: "Drinking", key: "Drinking" },
    { label: "Eating", key: "Eating" },
    { label: "Cell Phone Usage", key: "OnPhone" },
    { label: "Seatbelt Off", key: "SeatbeltOff" },
    { label: "Sleeping", key: "Sleeping" },
    { label: "Smoking", key: "Smoking" },
    { label: "Out of Lane", key: "OutOfLane" },
    { label: "Risky Drivers", key: "RiskyDrivers" },
    { label: "Unsafe Distance", key: "UnsafeDistance" },
    { label: "Hands on Wheel", key: "HandsOnWheel" },
  ];

  const icons = {
    good: (
      <IoMdCheckmarkCircle
        className={theme === "light" ? "text-green-500" : "text-green-400"}
      />
    ),
    alert: (
      <IoAlertCircle
        className={theme === "light" ? "text-yellow-500" : "text-yellow-400"}
      />
    ),
    bad: (
      <IoMdCloseCircle
        className={theme === "light" ? "text-red-500" : "text-red-400"}
      />
    ),
  };

  useEffect(() => {
    const newCounts = { ...warningCounts };

    for (const [key, value] of Object.entries(driverData)) {
      if (value === true && newCounts[key] !== undefined) {
        newCounts[key] += 1;
      }
    }

    setWarningCounts((prevCounts) => ({
      ...prevCounts,
      [driverData.Phone]: newCounts,
    }));
  }, [driverData]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (filter == "7 Day") {
      console.log("calling 7 day api");
    } else {
      console.log("calling 30 day api");
    }
  };

  return (
    <Card
      className={`py-2 rounded-xl bg-card text-card-foreground shadow border`}
    >
      <Card.Body>
        <div className="flex justify-between items-center">
          <Card.Title className="text-left text-xl font-bold">
            Warning Count
          </Card.Title>
          <DropdownButton variant="success" title={selectedFilter}>
            <Dropdown.Item onClick={() => handleFilterClick("7 Day")}>
              7 Day
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterClick("30 Day")}>
              30 Day
            </Dropdown.Item>
          </DropdownButton>
        </div>

        <div className="">
          {warnings.map(({ label, key }) => {
            const count =
              warningCounts[key] !== undefined ? warningCounts[key] : "...";
            return (
              <div
                key={label}
                className={`flex justify-between items-center px-3 py-2 rounded-md bg-secondary`}
              >
                <div className="flex items-center">
                  {count <= 3
                    ? icons.good
                    : count <= 5
                    ? icons.alert
                    : icons.bad}
                  <span className="ml-2 text-sm">{label}</span>
                </div>
                <span className="text-sm">{count}</span>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default WarningCount;
