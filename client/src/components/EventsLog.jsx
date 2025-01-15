import React, { useEffect, useState, useRef } from "react";

const EventsLog = ({ driverData }) => {
  const [events, setEvents] = useState([]);
  const eventsEndRef = useRef(null);

  useEffect(() => {
    const newEvents = [];

    // Check each property in driverData and log events if true
    for (const [key, value] of Object.entries(driverData)) {
      if (value === true) {
        newEvents.push({
          date: new Date(driverData.Timestamp).toLocaleString(), // Include both date and time
          eventType: key,
          durationOrLocation: "...",
          aiType: "Inside",
        });
      }
    }

    // Append new events to the existing events
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  }, [driverData]);

  useEffect(() => {
    // Scroll to the bottom of the events log
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  return (
    <div
      className="px-4 py-4 bg-[#f0f0f0] rounded-xl"
      style={{ height: "400px" }}
    >
      <h2 className="text-xl font-bold pb-4">Event Log</h2>
      <div
        className="events-log-table-container"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <table className="table table-striped">
          <thead className="text-md">
            <tr>
              <th scope="col" className="text-gray-500 font-thin">
                DATE
              </th>
              <th scope="col" className="text-gray-500 font-thin">
                EVENT TYPE
              </th>
              <th scope="col" className="text-gray-500 font-thin">
                DURATION/LOCATION
              </th>
              <th scope="col" className="text-gray-500 font-thin">
                AI TYPE
              </th>
            </tr>
          </thead>
          <tbody className="text-md">
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.date}</td>
                <td>{event.eventType}</td>
                <td>{event.durationOrLocation}</td>
                <td>{event.aiType}</td>
              </tr>
            ))}
            <tr ref={eventsEndRef} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsLog;
