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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { registerables } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ...registerables
);

function hexToRgba(hex, alpha = 0.15) {
  const trimmedHex = hex.replace("#", "");
  const r = parseInt(trimmedHex.substring(0, 2), 16);
  const g = parseInt(trimmedHex.substring(2, 4), 16);
  const b = parseInt(trimmedHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const primaryColor = "#f8b73d"; // Or your preferred primary color

export const tripGraphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "This Week's Trip Frequency", // Title text
      font: {
        size: 16,
      },
      color: "#333", // Adjust title color as needed
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `Trips: ${context.formattedValue}`; // Customize tooltip text
        },
      },
    },
  },
  scales: {
    x: {
      type: "category",
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      grid: {
        display: false,
      },
    },
    y: {
      title: { display: false },
      grid: { display: false },
      beginAtZero: true, // Start y-axis at 0 for trip counts
      ticks: {
        stepSize: 1, // Integer steps on the y-axis
      },
    },
  },
};

const TripGraph = () => {
  const { driverPhone } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchTripData = async () => {
    setLoading(true);
    setError(null);

    if (!driverPhone) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://aifsd.xyz/api/trips/${driverPhone}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const trips = await response.json();
      const dailyCounts = Array(7).fill(0);
      const today = new Date();

      trips.forEach((trip) => {
        const startTime = new Date(trip.start_time);
        const diffInDays = Math.floor(
          (today - startTime) / (1000 * 60 * 60 * 24)
        );
        if (diffInDays <= 6) {
          const dayOfWeek = startTime.getDay();
          dailyCounts[dayOfWeek]++;
        }
      });

      const tripDataset = {
        label: "Trip Frequency",
        data: dailyCounts,
        borderColor: primaryColor,
        backgroundColor: hexToRgba(primaryColor),
        borderWidth: 2,
        tension: 0.5,
        fill: true,
      };

      setTripData({
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [tripDataset],
      });
    } catch (err) {
      console.error("Error fetching trip data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [driverPhone]);

  if (loading) {
    return (
      <div className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4">
        Loading...
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

  if (!tripData) {
    return (
      <div className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4">
        No data available.
      </div>
    );
  }

  return (
    <div
      style={{ height: "23vh" }}
      className="border col-span-12 lg:col-span-4 bg-card shadow rounded-xl p-3 m-4"
    >
      <div>
        <Line options={tripGraphOptions} data={tripData} />
      </div>
    </div>
  );
};

export default TripGraph;
