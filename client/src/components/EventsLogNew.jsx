import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// TODO
// FIX BUG WHERE PAGINATION RESETS WHEN driverData CHANGES

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
          tripId: driverData.tripId || "Current Trip",
        });
      }
    }
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  }, [driverData]);

  // 2) Fetch risk events from the API
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
              tripId: event.trip_id || "Current Trip",
            });
          }
        }
      }

      setEvents((prevEvents) => [...prevEvents, ...parsedEvents]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (driverPhone) {
      fetchEvents();
    }
  }, [driverPhone]);

  // useEffect(() => {
  //   fetchEvents();
  // }, []);

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
