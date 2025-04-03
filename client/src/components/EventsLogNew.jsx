import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventsLogNew = ({ riskEvents }) => {
  const { driverPhone } = useParams();
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [tripRiskScores, setTripRiskScores] = useState({});

  const eventKeys = new Set([
    "drinking",
    "eating",
    "phone",
    "seatbelt_off",
    "sleeping",
    "smoking",
    "out_of_lane",
    "risky_drivers",
    "unsafe_distance",
    "hands_off_wheel",
  ]);

  // For the table trip rows
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchTripRiskScores = async () => {
        if (!driverPhone) return;
        try {
          const response = await fetch(
            `https://aifsd.xyz/api/driver-trips/${driverPhone}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const data = await response.json();
          const tripDataLookup = {};
          if (data.trips && Array.isArray(data.trips)) {
            data.trips.forEach((trip) => {
              tripDataLookup[trip.id.toString()] = {
                risk_score: trip.risk_score,
                start_time: trip.start_time,
                end_time: trip.end_time,
              };
            });
          }
          setTripRiskScores(tripDataLookup);
        } catch (error) {
          console.error("Failed to fetch trip risk scores:", error);
        }
      };
      fetchTripRiskScores();
    }, 1000);
    return () => clearInterval(interval);
  }, [driverPhone]);

  // Build events using the riskEvents passed from parent
  useEffect(() => {
    let newEvents = [];

    // Process riskEvents passed as a prop
    if (riskEvents && riskEvents.length > 0) {
      for (const event of riskEvents) {
        for (const [key, value] of Object.entries(event)) {
          if (eventKeys.has(key) && (value === true || (typeof value === "number" && value !== 0))) {
            const tripId = event.trip_id || "";
            newEvents.push({
              date: new Date(event.timestamp).toLocaleString(),
              eventType: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              durationOrLocation: event.durationOrLocation || "...",
              aiType: (["unsafe_distance", "out_of_lane", "risky_drivers"].includes(key) ? "Outside" : "Inside"),
              tripId: tripId,
              riskScore: tripRiskScores[tripId] || "N/A",
            });
          }
        }
      }
    }

    // Sort events descending by numeric tripId when possible.
    newEvents.sort((a, b) => {
      const aId = parseInt(a.tripId);
      const bId = parseInt(b.tripId);
      if (isNaN(aId) || isNaN(bId)) {
        return String(b.tripId).localeCompare(String(a.tripId));
      }
      return bId - aId;
    });

    setEvents(newEvents);
  }, [riskEvents, tripRiskScores]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date of Event",
        Cell: ({ row, cell }) => cell.getValue(),
        AggregatedCell: ({ row, cell }) => {
          const tripId = row.groupingValue;
          const tripData = tripRiskScores[tripId];
          if (tripData) {
            return (
              <div>
                <div>
                  <strong>Start:</strong>{" "}
                  {tripData.start_time
                    ? new Date(tripData.start_time).toLocaleString()
                    : "N/A"}
                </div>
                <div>
                  <strong>End:</strong>{" "}
                  {tripData.end_time ? (
                    new Date(tripData.end_time).toLocaleString()
                  ) : (
                    <strong style={{ color: "green" }}>In Progress</strong>
                  )}
                </div>
              </div>
            );
          }
          return cell.getValue();
        },
      },
      {
        accessorKey: "eventType",
        header: "Event Type",
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
      },
      {
        accessorKey: "riskScore",
        header: "Safety Score",
        Cell: ({ row, cell }) => {
          if (row.getIsGrouped()) {
            const tripId = row.groupingValue;
            const tripData = tripRiskScores[tripId];
            return (
              <span>
                {tripData
                  ? tripData.end_time
                    ? tripData.risk_score
                    : "..."
                  : "-"}
              </span>
            );
          }
          return null;
        },
        AggregatedCell: ({ row }) => {
          const tripId = row.groupingValue;
          const tripData = tripRiskScores[tripId];
          return (
            <span>
              {tripData
                ? tripData.end_time
                  ? tripData.risk_score
                  : "-"
                : "TBD"}
            </span>
          );
        },
      },
      {
        accessorKey: "aiType",
        header: "AI Type",
      },
    ],
    [tripRiskScores]
  );

  const baseBackgroundColor =
    theme === "dark" ? "rgba(25,24,23)" : "rgba(255,255,255,0.8)";
  const textColor = theme === "dark" ? "rgba(255,255,255,0.8)" : "#000";

  const table = useMaterialReactTable({
    columns,
    data: events,
    enableGrouping: true,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
    groupedColumnMode: "remove",
    initialState: {
      grouping: ["tripId"],
      columnOrder: ["riskScore", "date", "eventType", "tripId", "aiType"],
    },
    autoResetPageIndex: false,
    muiFilterTextFieldProps: { color: "secondary" },
    muiExpandButtonProps: { color: theme === "dark" ? "secondary" : "default" },
    muiTableBodyCellProps: {
      sx: { color: theme === "dark" ? "white" : "black" },
    },
    muiTableHeadCellProps: {
      sx: { color: theme === "dark" ? "white" : "black" },
    },
    muiExpandButtonProps: { sx: { color: theme === "dark" ? "#fff" : "#000" } },
    muiExpandAllButtonProps: {
      sx: { color: theme === "dark" ? "#fff" : "#000" },
    },
    muiToolbarAlertBannerProps: {
      sx: {
        backgroundColor: theme === "dark" ? "rgb(64,52,28)" : "#f1f1f1",
        color: theme === "dark" ? "#fff" : "#000",
      },
    },
    muiToolbarAlertBannerChipProps: {
      sx: {
        backgroundColor: theme === "dark" ? "rgba(29,24,23,255)" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      },
    },
    mrtTheme: () => ({
      baseBackgroundColor,
      textColor,
    }),
  });

  return <MaterialReactTable table={table} />;
};

export default EventsLogNew;
