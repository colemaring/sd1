import React, { useEffect, useState } from "react";
import { Card, Dropdown, DropdownButton } from "react-bootstrap";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import "../bootstrap-overrides.css";

const WarningCount = ({ riskEvents }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("7 Day");
  const [warningCounts, setWarningCounts] = useState({
    drinking: 0,
    eating: 0,
    phone: 0,
    seatbelt_off: 0,
    sleeping: 0,
    smoking: 0,
    out_of_lane: 0,
    risky_drivers: 0,
    unsafe_distance: 0,
    hands_off_wheel: 0,
  });

  const warnings = [
    { label: "Drinking", key: "drinking" },
    { label: "Eating", key: "eating" },
    { label: "Cell Phone Usage", key: "phone" },
    { label: "Seatbelt Off", key: "seatbelt_off" },
    { label: "Sleeping", key: "sleeping" },
    { label: "Smoking", key: "smoking" },
    { label: "Out of Lane", key: "out_of_lane" },
    { label: "Risky Drivers", key: "risky_drivers" },
    { label: "Unsafe Distance", key: "unsafe_distance" },
    { label: "Hands off Wheel", key: "hands_off_wheel" },
  ];

  const icons = {
    good: (
      <IoMdCheckmarkCircle
        className={theme === "light" ? "text-green-500" : "text-green-400"}
      />
    ),
    alert: (
      <IoAlertCircle
        className={theme === "light" ? "text-yellow-500" : "text-yellow-400"}
      />
    ),
    bad: (
      <IoMdCloseCircle
        className={theme === "light" ? "text-red-500" : "text-red-400"}
      />
    ),
  };

  useEffect(() => {
    const initializeCounts = () => {
      setWarningCounts({
        drinking: 0,
        eating: 0,
        phone: 0,
        seatbelt_off: 0,
        sleeping: 0,
        smoking: 0,
        out_of_lane: 0,
        risky_drivers: 0,
        unsafe_distance: 0,
        hands_off_wheel: 0,
      });
    };

    if (!riskEvents || !Array.isArray(riskEvents) || riskEvents.length === 0) {
      initializeCounts();
      return;
    }

    try {
      const now = new Date();
      const filteredEvents = riskEvents.filter((event) => {
        if (!event || !event.timestamp) return false;
        const eventDate = new Date(event.timestamp);
        if (selectedFilter === "7 Day") {
          return now - eventDate <= 7 * 24 * 60 * 60 * 1000;
        } else if (selectedFilter === "30 Day") {
          return now - eventDate <= 30 * 24 * 60 * 60 * 1000;
        }
        return false;
      });

      const newCounts = {
        drinking: 0,
        eating: 0,
        phone: 0,
        seatbelt_off: 0,
        sleeping: 0,
        smoking: 0,
        out_of_lane: 0,
        risky_drivers: 0,
        unsafe_distance: 0,
        hands_off_wheel: 0,
      };

      for (const event of filteredEvents) {
        for (const [key, value] of Object.entries(event)) {
          if (newCounts.hasOwnProperty(key)) {
            if (typeof value === "boolean" && value) {
              newCounts[key] += 1;
            } else if (typeof value === "number") {
              newCounts[key] += value;
            }
          }
        }        
      }

      setWarningCounts(newCounts);
    } catch (error) {
      console.error("Error processing risk events:", error);
      initializeCounts();
    }
  }, [riskEvents, selectedFilter]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    console.log(`Filter selected: ${filter}`);
  };

  return (
    <Card className="rounded-xl bg-card text-card-foreground shadow border">
      <Card.Body>
        <div className="flex justify-between items-center">
          <Card.Title className="text-left text-xl font-bold">
            Warning Count
          </Card.Title>
          <DropdownButton className="btn-primary-custom" title={selectedFilter}>
            <Dropdown.Item onClick={() => handleFilterClick("7 Day")}>
              7 Day
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterClick("30 Day")}>
              30 Day
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div>
          {warnings
            .sort((a, b) => {
              const countA =
                warningCounts[a.key] !== undefined ? warningCounts[a.key] : 0;
              const countB =
                warningCounts[b.key] !== undefined ? warningCounts[b.key] : 0;
              return countB - countA;
            })
            .map(({ label, key }) => {
              const count =
                warningCounts[key] !== undefined ? warningCounts[key] : "...";
              return (
                <div
                  key={label}
                  className="flex justify-between items-center px-3 py-2 rounded-md bg-secondary"
                >
                  <div className="flex items-center">
                    {count <= 3
                      ? icons.good
                      : count <= 5
                      ? icons.alert
                      : icons.bad}
                    <span className="ml-2 text-sm">{label}</span>
                  </div>
                  <span className="text-sm">{count}</span>
                </div>
              );
            })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default WarningCount;
