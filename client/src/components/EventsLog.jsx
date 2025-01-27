import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useDrivers } from "../context/DriverContext";

const EventsLog = ({ driverData }) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const eventsEndRef = useRef(null);

  useEffect(() => {
    const newEvents = [];
    for (const [key, value] of Object.entries(driverData)) {
      if (value === true) {
        newEvents.push({
          date: new Date(driverData.Timestamp).toLocaleString(),
          eventType: key,
          durationOrLocation: "...",
          aiType: "Inside",
        });
      }
    }
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  }, [driverData]);

  useEffect(() => {
    // if (eventsEndRef.current) {
    //   eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, [events]);

  // =====================================================================================
  // Testing risk events display

  const { data, isLoading } = useDrivers();

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch("http://localhost:5000/api/v1/trips");
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const tripsData = await response.json();
      setTrips(tripsData);
    };

    fetchTrips();
  }, []);

  const [riskEvents, setRiskEvents] = useState([]);

  useEffect(() => {
    const fetchRiskEvents = async () => {
      const response = await fetch("http://localhost:5000/api/v1/risks"); // Call the API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch risk events");
      }
      const data = await response.json();
      setRiskEvents(data); // Store the risk events in state
    };

    fetchRiskEvents(); // Call the async function
  }, []);

  const tripsWithRiskEvents = trips.map((trip) => {
    // Finding the risk events related to this trip
    const relevantRiskEvents = riskEvents.filter(
      (event) => event.trip_id === trip.id
    );

    // Finding the driver for this trip
    const phone = data.find((driver) => driver.phone_number === driverData);
    const driver = phone && phone.id === trip.driver_id;

    const riskEventsWithTrueFields = relevantRiskEvents.map((event) => {
      // Getting which event is set to true in risk events
      const trueEventNames = Object.keys(event)
        .filter((key) => typeof event[key] === "boolean" && event[key] === true)
        .map((key) => key.replace(/_/g, " ")); // removing _ from the names

      return {
        ...event,
        trueEvents: trueEventNames,
      };
    });

    return { ...trip, driver, riskEvents: riskEventsWithTrueFields };
  });

  return (
    <div
      className={`px-4 py-4 rounded-xl bg-card text-primary`}
      style={{ height: "400px" }}
    >
      <h2 className="text-xl font-bold pb-4">Event Log</h2>
      <div
        className={`rounded-md`}
        style={{ maxHeight: "300px", overflowY: "auto", padding: "8px" }}
      >
        <table className="table w-full text-sm bg-card">
          <thead className={`sticky top-0 bg-card text-primary`}>
            <tr>
              <th className="font-thin px-2 py-2 text-left text-primary">
                DATE
              </th>
              <th className="font-thin px-2 py-2 text-left text-primary">
                EVENT TYPE
              </th>
              <th className="font-thin px-2 py-2 text-left text-primary">
                DURATION/LOCATION
              </th>
              <th className="font-thin px-2 py-2 text-left text-primary">
                AI TYPE
              </th>
            </tr>
          </thead>
          <tbody>
            {tripsWithRiskEvents.map((trip) =>
              trip.riskEvents.map((event, index) => (
                <tr key={index} className="bg-card">
                  <td className="px-2 py-2 text-primary">{event.timestamp}</td>
                  <td className="px-2 py-2 text-primary">
                    {event.trueEvents.length > 0 ? (
                      <ul>
                        {event.trueEvents.map((eventName, idx) => (
                          <li key={idx}>{eventName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No risky events</p>
                    )}
                  </td>
                  <td className="px-2 py-2 text-primary">
                    {event.durationOrLocation}
                  </td>
                  <td className="px-2 py-2 text-primary">{trip.driver_id}</td>
                </tr>
              ))
            )}
            <tr ref={eventsEndRef} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsLog;
