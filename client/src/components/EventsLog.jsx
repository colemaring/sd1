import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useTheme } from "../context/ThemeContext";

const EventsLog = ({ driverData }) => {
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
        });
      }
    }
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
  }, [driverData]);

  // 2) Fetch risk events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
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

  // Compute pagination
  const totalRows = events.length;
  const totalPages = Math.max(Math.ceil(totalRows / rowsPerPage), 1);

  const lastRowIndex = currentPage * rowsPerPage;
  const firstRowIndex = lastRowIndex - rowsPerPage;
  const currentPageRows = events.slice(firstRowIndex, lastRowIndex);

  // If currentPage changes (e.g. via Next/Prev), sync the text field
  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  // Next/Prev
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Let user type in the page number
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  // On blur (or pressing Enter), parse & clamp
  const parseAndClampPage = () => {
    if (!pageInputValue) {
      setCurrentPage(1);
      setPageInputValue("1");
      return;
    }
    const parsed = parseInt(pageInputValue, 10);
    if (isNaN(parsed)) {
      setCurrentPage(1);
      setPageInputValue("1");
    } else {
      // Clamp between 1 and totalPages
      const newPage = Math.min(Math.max(1, parsed), totalPages);
      setCurrentPage(newPage);
      setPageInputValue(String(newPage));
    }
  };

  // Pressing Enter
  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      parseAndClampPage();
    }
  };

  return (
    <div
      className="p-4 rounded-xl bg-card text-card-foreground shadow border"
      style={{ height: "470px" }}
    >
      <h2 className="text-xl font-bold pb-2">Event Log</h2>
      <div
        className="rounded-md"
        style={{ maxHeight: "350px", overflowY: "auto" }}
      >
        <table className="table w-full text-sm bg-card">
          <thead className="sticky top-0 bg-card text-card-foreground">
            <tr>
              <th className="font-thin text-left text-primary">DATE OF EVENT</th>
              <th className="font-thin text-left text-primary">EVENT TYPE</th>
              <th className="font-thin text-left text-primary">
                DURATION/LOCATION
              </th>
              <th className="font-thin text-left text-primary">AI TYPE</th>
            </tr>
          </thead>
          <tbody>
            {currentPageRows.map((event, index) => (
              <tr key={index} className="bg-card">
                <td className="text-primary">{event.date}</td>
                <td className="text-primary">{event.eventType}</td>
                <td className="text-primary">{event.durationOrLocation}</td>
                <td className="text-primary">{event.aiType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-2 items-center">
        {/* Prev */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded disabled:opacity-50"
          style={{
            backgroundColor: `hsl(var(--primary))`,
            color: `hsl(var(--primary-foreground))`,
          }}
        >
          Prev
        </button>

        {/* Page Input */}
        <div className="flex items-center gap-1">
          <span>Page</span>
          <input
            type="text"
            className="w-12 text-center bg-card text-card-foreground rounded border focus:outline-none focus:ring-2 focus:ring-primary"
            value={pageInputValue}
            onChange={handlePageInputChange}
            onBlur={parseAndClampPage}
            onKeyDown={handlePageInputKeyDown}
          />
          <span>of {totalPages}</span>
        </div>

        {/* Next */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded disabled:opacity-50"
          style={{
            backgroundColor: `hsl(var(--primary))`,
            color: `hsl(var(--primary-foreground))`,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventsLog;
