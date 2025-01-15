import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";

const WarningCount = ({ driverData }) => {
  const [warningCounts, setWarningCounts] = useState({
    Drinking: 0,
    Eating: 0,
    Phone: 0,
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
    { label: "Cell Phone Usage", key: "Phone" },
    { label: "Seatbelt Off", key: "SeatbeltOff" },
    { label: "Sleeping", key: "Sleeping" },
    { label: "Smoking", key: "Smoking" },
    { label: "Out of Lane", key: "OutOfLane" },
    { label: "Risky Drivers", key: "RiskyDrivers" },
    { label: "Unsafe Distance", key: "UnsafeDistance" },
    { label: "Hands on Wheel", key: "HandsOnWheel" },
  ];

  const icons = {
    good: <IoMdCheckmarkCircle color="green" />,
    alert: <IoAlertCircle color="orange" />,
    bad: <IoMdCloseCircle color="red" />,
  };

  useEffect(() => {
    const newCounts = { ...warningCounts };

    // Check each property in driverData and increment counts if true
    for (const [key, value] of Object.entries(driverData)) {
      if (value === true && newCounts[key] !== undefined) {
        newCounts[key] += 1;
      }
    }

    setWarningCounts(newCounts);
  }, [driverData]);

  return (
    <Card border="none" className="rounded-4 bg-[#f0f0f0]">
      <Card.Body>
        <Card.Title className="text-left text-xl font-bold pl-5">
          Warning Count
        </Card.Title>
        {warnings.map(({ label, key }) => {
          const count =
            warningCounts[key] !== undefined ? warningCounts[key] : "...";
          return (
            <React.Fragment key={label}>
              <Card className="text-start border-0 p-0 bg-[#f0f0f0]">
                <Card.Body className="pb-1">
                  <div className="flex justify-between bg-[#f0f0f0] flex-nowrap">
                    <div className="flex p-2">
                      {count <= 3
                        ? icons.good
                        : count <= 5
                        ? icons.alert
                        : icons.bad}
                      <span className="ml-2 leading-3">{label}</span>
                    </div>
                    <span className="float-right">{count}</span>
                  </div>
                </Card.Body>
              </Card>
            </React.Fragment>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default WarningCount;
