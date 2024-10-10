import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // we can change to not bootstrap
import "../App.css";

const TruckInfo = () => {
  return (
    <div className="truck-info">
      <h5 className="title">Driver Info</h5>
      <div className="info-item">
        <span>Millage</span>
        <span>1,744</span>
      </div>
      <div className="info-item">
        <span>Current Speed</span>
        <span>60 mph</span>
      </div>
      <h5 className="title">Risk Score</h5>
      <div className="risk-score-container">
        {/* this circle part was just AI generated */}
        <div className="circle">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e0e0e0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#28a745"
              strokeWidth="10"
              fill="none"
              strokeDasharray="120 100"
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="black"
              fontSize="12"
            >
              User 120
            </text>
          </svg>
        </div>
      </div>
      <div className="button-container">
        <Button variant="outline-secondary" className="button cancel">
          Cancel
        </Button>
        <Button variant="primary" className="button">
          More
        </Button>
      </div>
    </div>
  );
};

export default TruckInfo;
