import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { registerables } from "chart.js";
import { useTheme } from "../../context/ThemeContext";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ...registerables
);

function hexToRgba(hex, alpha = 0.15) {
  const trimmedHex = hex.replace("#", "");
  const r = parseInt(trimmedHex.substring(0, 2), 16);
  const g = parseInt(trimmedHex.substring(2, 4), 16);
  const b = parseInt(trimmedHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const primaryColor = "#f8b73d";

function RiskHistoryGraph() {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const [riskHistory, setRiskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const riskGraphOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Safety Score History (30 Days)",
        font: {
          size: 15,
        },
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Safety Score: ${context.formattedValue}`;
          },
          afterLabel: function (context) {
            const item = context.raw;
            const startTime = item.startTime
              ? new Date(item.startTime).toLocaleString()
              : "N/A";
            const endTime = item.endTime
              ? new Date(item.endTime).toLocaleString()
              : "In Progress";
            return [
              `Trip ID: ${item.tripId}`,
              `Start Time: ${startTime}`,
              `End Time: ${endTime}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM d, yyyy",
          displayFormats: {
            day: "MMM d",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
        title: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        beginAtZero: false,
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  };

  useEffect(() => {
    // Fectch trip data every second
    const fetchTripData = async () => {
      try {
        setError(null);

        if (!driverPhone) {
          return;
        }

        const response = await fetch(
          `https://aifsd.xyz/api/driver-trips/${driverPhone}`
        );

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const data = await response.json();

        if (!data.trips || !Array.isArray(data.trips)) {
          throw new Error("Invalid response format");
        }

        // Calculate date from one month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        // Format and filter trips data for the chart
        const formattedTrips = data.trips
          .filter((trip) => {
            // If no end_time, it's current and should be included
            if (!trip.end_time) return true;

            const tripDate = new Date(trip.end_time);
            return tripDate >= oneMonthAgo;
          })
          .map((trip) => ({
            tripId: trip.id,
            y: parseFloat(trip.risk_score),
            x: new Date(trip.end_time || new Date()), // Use current time if trip hasn't ended
            timestamp: trip.end_time || new Date().toISOString(),
            endTime: trip.end_time,
            startTime: trip.start_time,
          }))
          .sort((a, b) => a.tripId - b.tripId); // Sort ascending

        setRiskHistory(formattedTrips);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();

    const intervalId = setInterval(() => {
      fetchTripData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [driverPhone]);

  if (loading) {
    return (
      <div className="col-span-12 lg:col-span-4 bg-gray-300 shadow rounded-xl p-3 m-4 h-[214px] animate-pulse items-center content-center text-center">
        <p className="font-bold text-xl">Loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4">
        Error: {error}
      </div>
    );
  }

  if (riskHistory.length === 0) {
    return (
      <div className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4">
        No risk history available.
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: "Risk Score",
        data: riskHistory,
        borderColor: primaryColor,
        backgroundColor: hexToRgba(primaryColor),
        borderWidth: 2,
        tension: 0.5,
        fill: true,
      },
    ],
  };

  return (
    <div className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-2 m-4">
      <div style={{ height: "21.2vh" }}>
        <Line options={riskGraphOptions} data={chartData} />
      </div>
    </div>
  );
}
export default RiskHistoryGraph;
