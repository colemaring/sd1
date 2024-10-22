import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCircle } from "react-icons/fa";

export default function DriversScoreTable() {
  const driver = [
    { name: "Driver 1", insideScore: 80, outsideScore: 20 },
    { name: "Driver 2", insideScore: 70, outsideScore: 30 },
    { name: "Driver 3", insideScore: 60, outsideScore: 50 },
    { name: "Driver 4", insideScore: 10, outsideScore: 90 },
    { name: "Driver 5", insideScore: 50, outsideScore: 50 },
  ];

  return (
    <Card style={{ width: "18rem" }} className="rounded-4">
      <Card.Body>
        <Card.Title className="text-center">Driver's Risk Score</Card.Title>
        {driver.map(({ name, insideScore, outsideScore }) => (
          <>
            <Card className="text-start border-0">
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <ProgressBar>
                  <ProgressBar variant="success" now={insideScore} />
                  <ProgressBar variant="warning" now={outsideScore} />
                </ProgressBar>
                <Card.Text>
                  <span className="pe-4">
                    <FaCircle color="green" size={10} /> Inside
                  </span>
                  <FaCircle color="orange" size={10} /> Outside
                </Card.Text>
              </Card.Body>
            </Card>
            <br />
          </>
        ))}
      </Card.Body>
    </Card>
  );
}
