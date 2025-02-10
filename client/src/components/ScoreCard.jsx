import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ScoreCard({ name, phone, score, change, active }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track the active dropdown

  const toggleDropdown = (name) => {
    // If the clicked dropdown is already open, close it. Otherwise, open the new one.
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleCardClick = () => {
    navigate(`/driver/${phone}`); // Navigate to /driver/phonenumber
  };

  const getRiskLevel = (score) => {
    if (score > 80) return "Low Risk";
    if (score > 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      <div
        key={name}
        className="relative shadow cardBorder flex rounded-xl w-72 p-4 bg-card text-foreground shadow-md cursor-pointer border transition-transform duration-300 ease-in-out hover:scale-[1.02]"
        onClick={handleCardClick} // Add onClick handler
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-muted w-16 h-16">
            <img
              src={`https://api.dicebear.com/9.x/micah/svg?seed=${phone}&mouth=laughing,smile,smirk`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* On/off signal */}
        <div className="absolute top-[65%] left-[12%] transform">
          {active ? (
            <>
              <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
              <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
            </>
          ) : (
            <span className="absolute rounded-full bg-red-500 w-6 h-6"></span>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex flex-col pl-4 w-full">
          <div className="text-center">
            <h3 className="text-sm text-muted-foreground">
              {getRiskLevel(score)}
            </h3>
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
        {/* <div className="absolute top-2 right-2">
          <button
            className="text-xl rounded-full bg-muted p-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              toggleDropdown(name);
            }}
          >
            ...
          </button>
          {activeDropdown === name && (
            <div className="absolute right-0 mt-2 w-40 bg-card shadow-lg rounded-lg">
              <ul>
                <li className="p-2 hover:bg-muted">Option 1</li>
                <li className="p-2 hover:bg-muted">Option 2</li>
                <li className="p-2 hover:bg-muted">Option 3</li>
              </ul>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default ScoreCard;
