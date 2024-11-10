import React from "react";
import { Card } from "react-bootstrap";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";

export default function WarningCount() {
  const warnings = [
    { label: "Cell Phone Usage", count: 23 },
    { label: "Collision Warnings", count: 23 },
    { label: "Distractions", count: 11 },
    { label: "Lane weaving", count: 11 },
    { label: "Seatbelt off", count: 5 },
    { label: "Speeding", count: 3 },
    { label: "Camera obstruction", count: 0 },
    { label: "Smoking", count: 0 },
  ];

  const icons = {
    good: <IoMdCheckmarkCircle color="green" />,
    alert: <IoAlertCircle color="orange" />,
    bad: <IoMdCloseCircle color="red" />,
  };

  return (
    <Card border="none" className="rounded-4 bg-[#f0f0f0]">
      <Card.Body>
        <Card.Title className="text-left text-xl font-bold pl-5">
          Warning Count
        </Card.Title>
        {warnings.map(({ label, count, index }) => (
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
                </div>{" "}
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </Card.Body>
    </Card>
  );
}
