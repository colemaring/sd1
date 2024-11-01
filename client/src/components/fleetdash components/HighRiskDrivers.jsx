import React from "react";
// import "../components/styles/fleetdash.css";
// import "../styles/highriskdriver.css";

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
    <div className="shadow-2xl rounded-xl overflow-hidden mr-2 h-full">
      <h3 className="text-center py-4 font-bold text-xl">
        High Risk Score Drivers
      </h3>
      <div className="drivers flex justify-around ">
        {drivers.map(({ name, phone, score }) => (
          <div
            className=" flex flex-column items-center m-3"
            key={name}
          >
            {/* change icon to image eventually */}
            <FaRegCircleUser size={30} />
            <p className="text-center m-0 pt-1 md:text-small">
              {name} <br /> {phone}
            </p>
            <h2 className="font-bold text-xl md:text-md">{score}</h2>
            <PiSpeedometer size={30} />
            Risk score
            <Button className="bg-green-400 mt-2 border-none">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighRiskDrivers;
