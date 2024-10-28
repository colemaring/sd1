import React from "react";
// import "../components/styles/fleetdash.css";
import "../styles/highriskdriver.css";

//icons
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCircleAlert } from "react-icons/ci";
import { PiSpeedometer } from "react-icons/pi";
import { Badge, Button } from "react-bootstrap";

function HighRiskDrivers() {
  const drivers = [
    { name: "Jane Doe", phone: "+1 (123) 123-1234", score: 540 },
    { name: "John Doe", phone: "+1 (123) 123-1234", score: 320 },
    { name: "Alice S.", phone: "+1 (123) 123-1234", score: 310 },
  ];
  return (
    <div className="high-container">
      <h3>High Risk Score Drivers</h3>
      <div className="drivers d-flex justify">
        {drivers.map(({ name, phone, score }) => (
          <div className="single-driver d-flex flex-column align-items-center p-4">
            {/* change icon to image eventually */}
            <FaRegCircleUser size={50} />
            <p className="text-center m-0 pt-1">
              {name} <br /> {phone}
            </p>
            <h2 className="p-1">{score}</h2>
            <PiSpeedometer size={30} />
            Risk score
            <Button className="details-button">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighRiskDrivers;
