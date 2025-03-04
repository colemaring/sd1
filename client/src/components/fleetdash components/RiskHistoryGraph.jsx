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
        text: "Risk Score History (7 Days)",
        font: {
          size: 15,
        },
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Risk Score: ${context.formattedValue}`;
          },
          afterLabel: function (context) {
            const item = riskHistory[context.dataIndex];
            const from = new Date(item.from_timestamp).toLocaleString(); // Shows both date and time
            const to = item.to_timestamp
              ? new Date(item.to_timestamp).toLocaleString() // Shows both date and time
              : "Present";
            return [`From: ${from}`, `To: ${to}`];
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
        min: 60,
        max: 104,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        beginAtZero: false,
        ticks: {
          color: theme === "dark" ? "#ffffff" : "#000000",
          callback: function (value) {
            if (value <= 100) {
              return value;
            } else {
              return "";
            }
          },
        },
      },
    },
  };

  useEffect(() => {
    // Function to fetch risk history data
    const fetchRiskHistory = async () => {
      try {
        console.log("Fetching risk history for phone:", driverPhone);
        setLoading(false); // Don't show loading indicator on refreshes
        setError(null);

        if (!driverPhone) {
          return;
        }

        const response = await fetch(
          `https://aifsd.xyz/api/driver_risk_history/driver/phone/${driverPhone}`
        );

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const data = await response.json();

        // Calculate date from one week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Filter data to only include entries from the past week
        const filteredData = data.filter((item) => {
          const itemDate = new Date(item.from_timestamp);
          return itemDate >= oneWeekAgo;
        });

        // Sort by from_timestamp in ascending order for the chart
        const sortedData = filteredData.sort(
          (a, b) => new Date(a.from_timestamp) - new Date(b.from_timestamp)
        );

        setRiskHistory(sortedData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRiskHistory();

    // Set up interval to fetch data every second
    const intervalId = setInterval(() => {
      fetchRiskHistory();
    }, 1000);

    // Clean up the interval when component unmounts
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
        data: riskHistory.map((item) => ({
          x: new Date(item.from_timestamp),
          y: parseFloat(item.risk_score),
        })),
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
