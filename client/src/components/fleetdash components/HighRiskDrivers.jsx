import React, { useState } from "react";

function HighRiskDrivers() {
  const drivers = [
    { name: "Jane Doe", phone: "+1 (123) 123-1234", score: 540 },
    { name: "John Doe", phone: "+1 (123) 123-1234", score: 320 },
  ];

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="flex h-full w-[70%]">
      {drivers.map(({ name, phone, score }) => (
        <div
          key={name}
          className="relative flex rounded-xl w-2/6 mx-4 p-4 overflow-hidden text-foreground bg-muted"
        >
          {/* Card Content */}
          <div className="flex flex-col">
            {/* Profile Picture */}
            <div className="rounded-full bg-background w-20 h-20 text-center"></div>
          </div>

          {/* On/off signal */}
          <div className="absolute top-[70%] left-[13%] transform">
            <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
            <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
          </div>

          {/* Driver Info */}
          <div className="flex flex-col relative pl-2">
            <div className="pt-1">
              <h3 className="text-md">High Risk</h3>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <h3 className="text-sm">{phone}</h3>
              <h1 className="text-6xl font-normal pt-4">{score}</h1>
              <h3 className="text-center">Risk Score</h3>
            </div>
            <div className="relative bottom-16 left-28">
              <h3 className="text-2xl text-destructive font-medium">+3.2%</h3>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              className="relative left-24 text-2xl rounded-full bg-background h-8 w-10 pb-12"
              onClick={toggleDropdown}
            >
              ...
            </button>
            {dropdownVisible && (
              <div className="absolute left-[-2em] mt-4 w-40 bg-card shadow-lg rounded-lg">
                <ul>
                  <li className="p-2 hover:bg-muted">Option 1</li>
                  <li className="p-2 hover:bg-muted">Option 2</li>
                  <li className="p-2 hover:bg-muted">Option 3</li>
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
