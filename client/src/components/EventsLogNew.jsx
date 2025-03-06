import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { DriverRiskEventsContext } from "../context/DriverRiskEventsContext";
import { useContext } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EventsLogNew = ({ driverData }) => {
  const { driverPhone } = useParams();
  const { theme } = useTheme();
  const riskEvents = useContext(DriverRiskEventsContext);
  const [events, setEvents] = useState([]);
  const [tripRiskScores, setTripRiskScores] = useState({});

  // Fetch trip risk scores
  useEffect(() => {
    const fetchTripRiskScores = async () => {
      if (!driverPhone) return;

      try {
        const response = await fetch(
          `https://aifsd.xyz/api/driver-trips/${driverPhone}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Convert to lookup object
        const tripDataLookup = {};
        if (data.trips && Array.isArray(data.trips)) {
          data.trips.forEach((trip) => {
            // Convert the trip id to a string
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
  }, [driverPhone]);

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
            riskScore: "Current",
          });
        }
      }
    }

    // Parse risk events from context.
    if (riskEvents && riskEvents.length > 0) {
      for (const event of riskEvents) {
        for (const [key, value] of Object.entries(event)) {
          if (value === true) {
            const tripId = event.trip_id || "Current Trip";
            newEvents.push({
              date: new Date(event.timestamp).toLocaleString(),
              eventType: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              durationOrLocation: event.durationOrLocation || "...",
              aiType: event.aiType || "Inside",
              tripId: tripId,
              riskScore: tripRiskScores[tripId] || "bruh",
            });
          }
        }
      }
    }

    const sortedEvents = newEvents.sort((a, b) => {
      if (a.tripId === "Current Trip") return -1; // Current Trip always first
      if (b.tripId === "Current Trip") return 1;

      // For numeric trip IDs, sort from highest to lowest
      const aId = parseInt(a.tripId);
      const bId = parseInt(b.tripId);

      // If parsing fails, fall back to string comparison
      if (isNaN(aId) || isNaN(bId)) {
        return String(b.tripId).localeCompare(String(a.tripId)); // Reverse order
      }

      return bId - aId; // Sort numerically in descending order
    });

    setEvents(sortedEvents);
  }, [driverData, riskEvents, tripRiskScores]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date of Event",
        Cell: ({ row, cell }) => {
          // For individual event rows, return the regular date
          return cell.getValue();
        },
        AggregatedCell: ({ row, cell }) => {
          // This is a grouped row (trip row)
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
                  {tripData.end_time
                    ? new Date(tripData.end_time).toLocaleString()
                    : "In Progress"}
                </div>
              </div>
            );
          }
          return cell.getValue(); // fallback if no tripData found
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
        // For regular (non-grouped) rows, hide risk score
        Cell: ({ row, cell }) => {
          if (row.getIsGrouped()) {
            // We are in a group header (trip row)
            const tripId = row.groupingValue;
            const tripData = tripRiskScores[tripId];
            console.log(tripData.risk_score + " test");
            return <span>{tripData ? tripData.risk_score : "-"}</span>;
          }
          // Otherwise, do not display risk score for individual risk event rows
          return null;
        },
        // For grouped rows (trip header), show the safety score
        AggregatedCell: ({ row }) => {
          const tripId = row.groupingValue;
          const tripData = tripRiskScores[tripId];
          return <span>{tripData ? tripData.risk_score : "-"}</span>;
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
    theme === "dark" ? "rgba(25,24,23)" : "rgba(255, 255, 255, 0.8)";

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
    muiExpandButtonProps: {
      sx: {
        color: theme === "dark" ? "#fff" : "#000",
      },
    },

    muiExpandAllButtonProps: {
      sx: {
        color: theme === "dark" ? "#fff" : "#000",
      },
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

    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      textColor: textColor,
    }),
  });

  return <MaterialReactTable table={table} />;
};

export default EventsLogNew;
