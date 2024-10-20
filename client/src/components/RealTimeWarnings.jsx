import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button } from "react-bootstrap";
import { IoWarningOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import "../App.css";

export default function RealTimeWarnings() {
  return (
    <Card style={{ width: "18rem" }} className="rounded-4">
      <Card.Body>
        <Card.Title className="border-bottom pb-2">
          <div className="realtimewarn">
            <IoWarningOutline
              size={50}
              className="bg-danger rounded-4 p-2"
              color="white"
            />
            <span className="h1 m-2 pl-3">10</span>
          </div>
          <span className="h6 text-secondary">Real-time Warnings</span>
        </Card.Title>
        <Button
          variant="primary"
          className="flex-end bg-light text-dark border-0"
        >
          View Details <FaArrowRight className="flex-end" />
        </Button>
      </Card.Body>
    </Card>
  );
}
