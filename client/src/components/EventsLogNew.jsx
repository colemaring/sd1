import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DriverRiskEventsContext } from "../context/DriverRiskEventsContext";
import { useContext } from "react";

// TODO
// FIX BUG WHERE PAGINATION RESETS WHEN driverData CHANGES
// FIX "CURRENT TRIP" IMPLEMENTATION

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventsLogNew = ({ driverData }) => {
  const { driverPhone } = useParams(); // phone number from URL
  const { theme } = useTheme();
  const riskEvents = useContext(DriverRiskEventsContext);
  const [events, setEvents] = useState([]);

  // Combine driverData events and risk events from context
  useEffect(() => {
    const newEvents = [];

    // Convert driverData to events.
    if (driverData) {
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
    }

    // Parse risk events from context.
    if (riskEvents && riskEvents.length > 0) {
      for (const event of riskEvents) {
        for (const [key, value] of Object.entries(event)) {
          if (value === true) {
            newEvents.push({
              date: new Date(event.timestamp).toLocaleString(),
              eventType: key,
              durationOrLocation: event.durationOrLocation || "...",
              aiType: event.aiType || "Inside",
              tripId: event.trip_id || "Current Trip",
            });
          }
        }
      }
    }

    setEvents(newEvents);
  }, [driverData, riskEvents]);

  // Table columns
  const columns = useMemo(
    () => [
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
        header: "Trip ID",
      },
    ],
    []
  );

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
