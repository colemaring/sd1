import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const riskEventKeys = [
  "drinking",
  "eating",
  "seatbelt_off",
  "sleeping",
  "smoking",
  "out_of_lane",
  "unsafe_distance",
  "hands_off_wheel",
];

const getRiskEventType = (event) => {
  const types = riskEventKeys.filter((key) => event[key]);
  return types.length > 0 ? types.join(", ") : "N/A";
};

const Notifications = () => {
  const [riskEvents, setRiskEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRiskEvents = async () => {
      try {
        const response = await fetch(
          "https://aifsd.xyz/api/risk-events-details"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRiskEvents(data);
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };

    fetchRiskEvents();
  }, []);

  // Filter events to include only those with at least one truthy risk event value.
  const filteredEvents = riskEvents.filter((event) =>
    riskEventKeys.some((key) => event[key])
  );

  // Sort risk events descending by timestamp (most recent first)
  const sortedDesc = filteredEvents.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const recentEvents = sortedDesc.slice(0, 3);

  // Handler for clicking a notification card.
  const handleCardClick = (phoneNumber) => {
    navigate(`/driver/${phoneNumber}`);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex justify-between mb-2">
        <h1 className="text-xl font-bold text-start text-foreground">
          Notifications
        </h1>
        <a
          href="#"
          className="text-md font-semibold hover:underline"
          style={{ color: `hsl(var(--primary))` }}
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          View All
        </a>
      </div>

      {/* Notifications List (Most recent 3 filtered risk events) */}
      {recentEvents.map((event) => (
        <div
          key={event.id}
          className="bg-card text-card-foreground shadow p-3 rounded-xl mt-3 text-sm border cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.02]"
          onClick={() => handleCardClick(event.phone_number)}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 flex-shrink-0">
              <img
                src={`https://api.dicebear.com/9.x/micah/svg?seed=${event.phone_number}&mouth=laughing,smile,smirk`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{getRiskEventType(event)}</span>
              <span className="text-xs text-muted-foreground">
                Driver: {event.driver_name || "N/A"}
              </span>
              <span className="text-xs text-muted-foreground">
                Phone: {event.phone_number ? event.phone_number : "N/A"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Modal for viewing all filtered risk events in descending order */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>All High Risk Event Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {sortedDesc.map((event) => (
            <div
              key={event.id}
              className="bg-card text-card-foreground shadow p-3 rounded-xl mt-3 text-sm border cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.02]"
              onClick={() => handleCardClick(event.phone_number)}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 flex-shrink-0">
                  <img
                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${event.phone_number}&mouth=laughing,smile,smirk`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{getRiskEventType(event)}</span>
                  <span className="text-xs text-muted-foreground">
                    Driver: {event.driver_name || "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Phone: {event.phone_number ? event.phone_number : "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
