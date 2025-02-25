import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { DriverRiskEventsContext } from "../context/DriverRiskEventsContext";
import { useContext } from "react";

// TODO
// when last flag is recieved, trigger table reload

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventsLogNew = ({ driverData }) => {
  const { driverPhone } = useParams();
  const { theme } = useTheme();
  const riskEvents = useContext(DriverRiskEventsContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let newEvents = [];

    // Convert driverData to events.
    if (driverData) {
      for (const [key, value] of Object.entries(driverData)) {
        if (value === true && key !== "FirstFlag" && key !== "LastFlag") {
          newEvents.push({
            date: new Date(driverData.Timestamp).toLocaleString(),
            eventType: key,
            durationOrLocation: "...",
            aiType: "Inside",
            tripId: "Current Trip",
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
              eventType: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              durationOrLocation: event.durationOrLocation || "...",
              aiType: event.aiType || "Inside",
              tripId: event.trip_id || "Current Trip",
            });
          }
        }
      }
    }

    const newCurrentTripEvents = newEvents.filter(
      (event) => event.tripId === "Current Trip"
    );
    const newNonCurrentEvents = newEvents.filter(
      (event) => event.tripId !== "Current Trip"
    );

    setEvents((prevEvents) => {
      const prevNonCurrent = prevEvents.filter(
        (event) => event.tripId !== "Current Trip"
      );
      const prevCurrent = prevEvents.filter(
        (event) => event.tripId === "Current Trip"
      );
      return [...newNonCurrentEvents, ...prevCurrent, ...newCurrentTripEvents];
    });
  }, [driverData, riskEvents]);

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

  
  const baseBackgroundColor = theme === 'dark'
    ? 'rgba(19, 19, 19, 0.8)'
    : 'rgba(255, 255, 255, 0.8)';

  const textColor = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "#000";

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
    autoResetPageIndex: false,
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      textColor: textColor,
    }),
  });

  return <MaterialReactTable table={table} />;
};

export default EventsLogNew;
