import React, { useState } from "react";
// import "../components/styles/fleetdash.css";
// import "../styles/highriskdriver.css";

//icons
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCircleAlert } from "react-icons/ci";
import { PiSpeedometer } from "react-icons/pi";
import { Badge, Button, Dropdown } from "react-bootstrap";

// This component displays three drivers' main information based on the main page
// The drivers change depending on the filter selection
function HighRiskDrivers() {
  const drivers = [
    { name: "Jane Doe", phone: "+1 (123) 123-1234", score: 540 },
    { name: "John Doe", phone: "+1 (123) 123-1234", score: 320 },
  ];

  // WIP - Make it appear only in the index that it was clicked on
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    // row container
    <div className="flex h-full w-[70%]">
      {drivers.map(({ name, phone, score }) => (
        // individual driver container
        <div
          key={name}
          className="flex rounded-xl bg-[#f0f0f0] w-2/6 mx-4 p-4 overflow-hidden"
        >
          <div className="relative flex flex-col">
            {/* Profile Picture */}
            <div className="rounded-full bg-[#d9d9d9] w-20 h-20 text-center"></div>
            {/* On/off signal */}
            <span className="absolute rounded-full bg-green-500 w-6 h-6 bottom-0 left-2 inline-flex animate-ping"></span>
            <span className="relative top-[4.5rem] left-2 inline-flex rounded-full h-6 w-6 bg-green-700"></span>
          </div>
          {/* Driver information - left side */}
          <div className="flex flex-col relative pl-2">
            <div className="pt-1">
              <h3 className="text-md">High Risk</h3>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <h3 className="text-sm">{phone}</h3>
              <h1 className="text-6xl font-normal pt-4">{score}</h1>
              <h3 className="text-center">Risk Score</h3>
            </div>
            {/* Risk score percentage inc/dec */}
            <div className="relative bottom-16 left-28">
              <h3 className="text-2xl text-red-500 font-medium">+3.2%</h3>
            </div>
          </div>
          {/* Button to toggle the dropdown */}
          <div className="relative">
            <button
              className="relative left-24 text-2xl rounded-full bg-white h-8 w-10 pb-12"
              onClick={toggleDropdown}
            >
              ...
            </button>

            {/* Dropdown menu */}
            {dropdownVisible && (
              <div className="absolute left-[-2em] mt-4 w-40 bg-white shadow-lg rounded-lg">
                <ul>
                  <li className="p-2 hover:bg-gray-100">Option 1</li>
                  <li className="p-2 hover:bg-gray-100">Option 2</li>
                  <li className="p-2 hover:bg-gray-100">Option 3</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HighRiskDrivers;
