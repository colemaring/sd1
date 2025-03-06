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

export default function Notifications() {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [riskEvents, setRiskEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alertEvent, setAlertEvent] = useState(null);
  const [handledEventIds, setHandledEventIds] = useState([]);

  useEffect(() => {
    const fetchRiskEvents = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/risk-events-details");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRiskEvents(data);
        setLoading(false);

        const newSleepingEvents = data.filter((ev) => {
          if (!ev.sleeping) return false;
          if (handledEventIds.includes(ev.id)) return false;
          const eventTime = new Date(ev.timestamp).getTime();
          return eventTime >= startTime;
        });

        // If we already have an alert for a driver, skip new events from that driver.
        // If there's a new event for a different driver, show it.
        if (newSleepingEvents.length) {
          if (alertEvent) {
            const differentDriverEvent = newSleepingEvents.find(
              (ev) => ev.phone_number !== alertEvent.phone_number
            );
            if (differentDriverEvent) setAlertEvent(differentDriverEvent);
          } else {
            setAlertEvent(newSleepingEvents[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };
    fetchRiskEvents();
    const interval = setInterval(fetchRiskEvents, 1000);
    return () => clearInterval(interval);
  }, [startTime, handledEventIds, alertEvent]);

  const filteredEvents = riskEvents.filter((event) =>
    riskEventKeys.some((key) => event[key])
  );
  const sortedDesc = [...filteredEvents].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const recentEvents = sortedDesc.slice(0, 3);

  const handleCardClick = (phoneNumber) => {
    navigate(`/driver/${phoneNumber}`);
  };

  const dismissAlert = () => {
    if (alertEvent) {
      setHandledEventIds((prev) => [...prev, alertEvent.id]);
    }
    setAlertEvent(null);
  };

  if (loading) {
    return (
      <div className="h-full">
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
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-row animate-pulse">
            <svg
              className="w-10 h-10 text-gray-200 mr-2 self-center"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div className="bg-gray-300 w-full h-14 rounded-xl mb-3 mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full">
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
                Phone:{" "}
                {event.phone_number
                  ? event.phone_number.replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      "($1) $2-$3"
                    )
                  : "N/A"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

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
                    Phone:{" "}
                    {event.phone_number
                      ? event.phone_number.replace(
                          /(\d{3})(\d{3})(\d{4})/,
                          "($1) $2-$3"
                        )
                      : "N/A"}
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

      <Modal show={!!alertEvent} onHide={dismissAlert} centered>
        <Modal.Header className="border-0">
          <Modal.Title className="fs-4 fw-bold text-danger">
            High Risk Event Detected
          </Modal.Title>
        </Modal.Header>
        {alertEvent && (
          <Modal.Body className="text-center">
            <p className="mb-2 fw-semibold">
              {alertEvent.driver_name} is currently <strong>sleeping</strong>.
            </p>
            <p className="mb-0 fw-light">Please contact them at:</p>
            <p
              className="fw-bold mt-3"
              style={{ fontSize: "1.5rem", lineHeight: 1.2 }}
            >
              {alertEvent.phone_number
                ? alertEvent.phone_number.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  )
                : "N/A"}
            </p>
          </Modal.Body>
        )}

        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button
            variant="secondary"
            onClick={dismissAlert}
            style={{ width: "100px" }}
          >
            Dismiss
          </Button>
          <Button
            variant="danger"
            onClick={dismissAlert}
            style={{ width: "100px" }}
          >
            Resolved
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
