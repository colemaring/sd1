import React, { useState } from "react";
import { Button } from "react-bootstrap";

const DashFilters = () => {
  const [eventLogOption, setEventLogOption] = useState("all");
  const [eventType, setEventType] = useState({
    PhoneUsage: true,
    UnsafeFollowing: true,
    Smoking: true,
    Eating: true,
    OutOfLane: true,
    Drinking: true,
    SeatbeltOff: true,
    Sleeping: true,
    HandsOffWheel: true,
  });
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);

  const handleEventLogChange = (e) => {
    setEventLogOption(e.target.value);
  };

  const handleEventTypeChange = (e) => {
    setEventType({
      ...eventType,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setEventType({
      PhoneUsage: isChecked,
      UnsafeFollowing: isChecked,
      Smoking: isChecked,
      Eating: isChecked,
      OutOfLane: isChecked,
      Drinking: isChecked,
      SeatbeltOff: isChecked,
      Sleeping: isChecked,
      HandsOffWheel: isChecked,
    });
  };

  const toggleEventTypeDropdown = () => {
    setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen);
  };

  const handleApplyFilter = () => {
    console.log("Applied Filters:", {
      eventType,
    });
  };

  return (
    <div className="col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4">
      <div className="mb-2">
        <h3 className="text-md font-medium">Range</h3>
        <select
          value={eventLogOption}
          onChange={handleEventLogChange}
          className="w-full p-2 border rounded"
          style={{
            backgroundColor: `hsl(var(--background))`,
            color: `hsl(var(--foreground))`,
            border: `none`,
          }}
        >
          <option value="most recent">Most Recent Trip</option>
          <option value="last 10">This Month's Trips</option>
          <option value="all">All Trips</option>
        </select>
      </div>
      <div className="mb-1">
        <h3 className="text-md font-medium">Event Type</h3>
        <div
          style={{
            backgroundColor: `hsl(var(--background))`,
            color: `hsl(var(--foreground))`,
            border: `none`,
          }}
          className="relative"
        >
          <button
            onClick={toggleEventTypeDropdown}
            className="w-full p-2 border rounded text-left"
          >
            Select Event Types
          </button>
          {isEventTypeDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border rounded mt-1 shadow-lg z-10">
              <div
                style={{
                  backgroundColor: `hsl(var(--background))`,
                  color: `hsl(var(--foreground))`,
                  border: `none`,
                }}
                className="flex flex-col p-2"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="selectAll"
                    checked={
                      eventType.PhoneUsage &&
                      eventType.UnsafeFollowing &&
                      eventType.Smoking &&
                      eventType.Eating &&
                      eventType.OutOfLane &&
                      eventType.Drinking &&
                      eventType.SeatbeltOff &&
                      eventType.Sleeping &&
                      eventType.HandsOffWheel
                    }
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  All
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="PhoneUsage"
                    checked={eventType.PhoneUsage}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Phone Usage
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="UnsafeFollowing"
                    checked={eventType.UnsafeFollowing}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Unsafe Following
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Smoking"
                    checked={eventType.Smoking}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Smoking
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Eating"
                    checked={eventType.Eating}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Eating
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="OutOfLane"
                    checked={eventType.OutOfLane}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Out Of Lane
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Drinking"
                    checked={eventType.Drinking}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Drinking
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="SeatbeltOff"
                    checked={eventType.SeatbeltOff}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Seatbelt Off
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Sleeping"
                    checked={eventType.Sleeping}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Sleeping
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="HandsOffWheel"
                    checked={eventType.HandsOffWheel}
                    onChange={handleEventTypeChange}
                    className="mr-2"
                  />
                  Hands Off Wheel
                </label>
              </div>
            </div>
          )}
        </div>
        <Button
          className="mt-3"
          style={{
            backgroundColor: `hsl(var(--primary))`,
            color: `hsl(var(--primary-foreground))`,
            border: "none",
          }}
          onClick={handleApplyFilter}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
};

export default DashFilters;
