import React, { useState } from "react";

function HighRiskDrivers() {
  const drivers = [
    { name: "Jane Doe", phone: "+1 (123) 123-1234", score: 50, change: "-3.2%" },
    { name: "John Doe", phone: "+1 (123) 313-3227", score: 67, change: "-1.8%" },
    { name: "Alice Smith", phone: "+1 (123) 987-6543", score: 45, change: "-2.5%" },
    { name: "Bob Johnson", phone: "+1 (123) 111-2222", score: 52, change: "+1.4%" },
    { name: "Charlie Brown", phone: "+1 (123) 555-6666", score: 38, change: "-4.1%" },
    // { name: "Dana White", phone: "+1 (123) 777-8888", score: 62, change: "-0.9%" },
  ];

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {drivers.map(({ name, phone, score, change }) => (
        <div
          key={name}
          className="relative flex rounded-xl w-72 p-4 bg-card text-foreground shadow-md"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-muted w-16 h-16"></div>
          </div>

          {/* On/off signal */}
          <div className="absolute top-[65%] left-[12%] transform">
            <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
            <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
          </div>

          {/* Driver Info */}
          <div className="flex flex-col pl-4 w-full">
            <div className="text-center">
              <h3 className="text-sm text-muted-foreground">High Risk</h3>
              <h1 className="text-lg font-semibold">{name}</h1>
              <h3 className="text-sm">{phone}</h3>
            </div>

            {/* Risk Score and Percentage Change */}
            <div className="flex flex-col items-center pt-4">
              <div className="flex items-baseline">
                <h1 className="text-4xl font-bold">{score}</h1>
                <h3 className="text-sm text-destructive font-medium pl-2">
                  {change}
                </h3>
              </div>
              <h3 className="text-xs text-muted-foreground">Safety Score</h3>
            </div>
          </div>

          {/* Dropdown */}
          <div className="absolute top-2 right-2">
            <button
              className="text-xl rounded-full bg-muted p-2"
              onClick={toggleDropdown}
            >
              ...
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-40 bg-card shadow-lg rounded-lg">
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
