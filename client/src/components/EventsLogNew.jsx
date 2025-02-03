import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventsLogNew = ({ driverData }) => {
  const { driverPhone } = useParams(); // phone number from URL
  const { theme } = useTheme();

  const [events, setEvents] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const rowsPerPage = 8;

  // 1) Convert driverData -> "newEvents"
  useEffect(() => {
    const newEvents = [];
    for (const [key, value] of Object.entries(driverData)) {
      if (value === true) {
        newEvents.push({
          date: new Date(driverData.Timestamp).toLocaleString(),
          eventType: key,
          durationOrLocation: "...",
          aiType: "Inside",
          tripId: driverData.tripId,
        });
      }
    }
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  }, [driverData]);

  // 2) Fetch risk events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEvents([]);
        setPageInputValue("1");
        setCurrentPage(1);
        // Fetch trips for the driver
        const tripsResponse = await fetch(
          `https://aifsd.xyz/api/trips/${driverPhone}`
        );
        const trips = await tripsResponse.json();
        const tripIds = trips.map((trip) => trip.id);

        // Fetch risk events for those trips
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

        // Parse them
        const parsedEvents = [];
        for (const event of riskEvents) {
          for (const [key, value] of Object.entries(event)) {
            if (value === true) {
              parsedEvents.push({
                date: new Date(event.timestamp).toLocaleString(),
                eventType: key,
                durationOrLocation: event.durationOrLocation || "...",
                aiType: event.aiType || "Inside",
                tripId: event.trip_id,
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

  // 3) WebSocket subscription (pushing new events in real-time)
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

  const columns = useMemo(() => [
    {
      accessorKey: "date",
      header: "Date of Event",
    },
    {
      accessorKey: "eventType",
      header: "Event Type",
    },
    {
      accessorKey: "aiType",
      header: "AI Type",
    },
    {
      accessorKey: "tripId",
      header: "Trid ID",
    },
  ]);

  const table = useMaterialReactTable({
    columns,
    data: events,
    enableGrouping: true,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
    groupedColumnMode: "remove",
    initialState: {
      grouping: ["tripId"],
    },
  });

  return <MaterialReactTable table={table} />;
};

export default EventsLogNew;
