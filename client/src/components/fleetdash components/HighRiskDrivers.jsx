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
    { name: "Bob K.", phone: "+1 (123) 123-1234", score: 300 },
  ];
  return (
    <div className="flex h-full">
      {drivers.map(({ name, phone, score }) => (
        <div className="flex rounded-xl bg-[#f0f0f0] w-2/5 mx-4 p-4 overflow-hidden">
          <div className="flex flex-col">
            <div className="rounded-full bg-[#d9d9d9] w-20 h-20 text-center"></div>
            <button className="rounded-xl bg-[#B8D8BE] relative top-14 p-2 hover:bg-green-500 text-gray-600">
              View Details
            </button>
          </div>
          <div className="flex flex-col relative">
            <div className="pt-1 relative right-4">
              <h3 className="text-md">High Risk</h3>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <h3 className="text-sm">{phone}</h3>
            </div>
            <div className="relative self-end top-3 left-14">
              <h1 className="text-7xl font-bold">{score}</h1>
              <h3 className="text-center">Risk Score</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HighRiskDrivers;

/* <div className="shadow-2xl rounded-xl overflow-hidden mr-2 h-full">
  <h3 className="text-center py-4 font-bold text-xl">
    High Risk Score Drivers
  </h3>
  <div className="drivers flex justify-around ">
    {drivers.map(({ name, phone, score }) => (
      <div
        className=" flex flex-column items-center m-3"
        key={name}
      >
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
</div> */
