import React from "react";
import { Card } from "react-bootstrap";

export default function RealTimeInfo() {
  const warnings = [
    { driver: "driver 1", label: "Speeding", location: "address" },
    { driver: "driver 3", label: "Smoking", location: "address" },
    { driver: "driver 2", label: "On cellphone", location: "address" },
    { driver: "driver 1", label: "Distracted", location: "address" },
  ];

  return (
    <Card style={{ width: "18rem" }} className="rounded-4">
      <Card.Body>
        <Card.Title className="text-center">Real-Time Warnings</Card.Title>
        {warnings.map(({ driver, label, location }) => (
          <React.Fragment>
            <Card className="text-start border-0">
              <Card.Body className="border-bottom">
                <Card.Title>{driver}</Card.Title>
                <Card.Text>
                  {label} at {location}
                </Card.Text>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </Card.Body>
    </Card>
  );
}
