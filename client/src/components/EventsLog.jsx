import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useTheme } from "../context/ThemeContext";

const EventsLog = ({ driverData }) => {
  const { driverPhone } = useParams(); // Get the phone number from the URL
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
    console.log(driverPhone + " phone");
    const fetchEvents = async () => {
      try {
        // Fetch trips for the driver
        const tripsResponse = await fetch(
          `https://aifsd.xyz/api/trips/${driverPhone}`
        );
        const trips = await tripsResponse.json();

        const tripIds = trips.map((trip) => trip.id);
        console.log(tripIds + " trips");

        // Fetch risk events for the trips
        const riskEventsResponse = await fetch(
          `https://aifsd.xyz/api/risk-events-id`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tripIds }),
          }
        );
        const riskEvents = await riskEventsResponse.json();

        // Parse the fetched risk events
        const parsedEvents = [];
        for (const event of riskEvents) {
          for (const [key, value] of Object.entries(event)) {
            if (value === true) {
              parsedEvents.push({
                date: new Date(event.timestamp).toLocaleString(),
                eventType: key,
                durationOrLocation: event.durationOrLocation || "...",
                aiType: event.aiType || "Inside",
              });
            }
          }
        }

        setEvents((prevEvents) => [...prevEvents, ...parsedEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (driverPhone) {
      fetchEvents();
    }
  }, [driverPhone]);

  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  useEffect(() => {
    const ws = new WebSocket("wss://your-websocket-url");

    ws.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

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
            {events.map((event, index) => (
              <tr key={index} className={`bg-card`}>
                <td className="px-2 py-2 text-primary">{event.date}</td>
                <td className="px-2 py-2 text-primary">{event.eventType}</td>
                <td className="px-2 py-2 text-primary">
                  {event.durationOrLocation}
                </td>
                <td className="px-2 py-2 text-primary">{event.aiType}</td>
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
