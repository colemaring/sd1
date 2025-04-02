import React, { useEffect, useState } from "react";
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
import { Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { registerables } from "chart.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/loader.css";

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

// Converts a hex color like "#f8b73d" into RGBA with the specified alpha
function hexToRgba(hex, alpha = 0.15) {
  const trimmedHex = hex.replace("#", "");
  const r = parseInt(trimmedHex.substring(0, 2), 16);
  const g = parseInt(trimmedHex.substring(2, 4), 16);
  const b = parseInt(trimmedHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const colors = [
  "#f8b73d",
  "#e53935",
  "#4caf50",
  "#9c27b0",
  "#2196f3",
  "#ff9800",
  "#795548",
  "#ffeb3b",
  "#cddc39",
  "#00bcd4",
];

export const options = (labels) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      align: "start",
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        font: {
          size: 12,
          family: "'Arial', sans-serif",
          weight: "bold",
        },
      },
    },
  },
  scales: {
    x: {
      type: "category",
      labels: labels,
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: 'Day of the Month',
        font: {
          size: 14,
          family: "'Arial', sans-serif",
          weight: "bold",
        },
      },
    },
    y: {
      title: {
        display: true,
        text: 'Risk Event Count',
        font: {
          size: 14,
          family: "'Arial', sans-serif",
          weight: "bold",
        },
      },
      grid: { display: false },
      ticks: {
        beginAtZero: true,
        min: 0,
      },
    },
  },
});

const AllStats = () => {
  const [chartData, setChartData] = useState(null);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate(); // Returns the last date of the month
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(displayedMonth);
    newMonth.setMonth(displayedMonth.getMonth() - 1);
    setDisplayedMonth(newMonth);
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(displayedMonth);
    newMonth.setMonth(displayedMonth.getMonth() + 1);
    setDisplayedMonth(newMonth);
    setSelectedMonth(newMonth);
  };

  const getMonthYearString = (date) => {
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchRiskEvents = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/risk-events");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const allRiskEvents = await response.json();

        const eventTypes = [
          "drinking",
          "eating",
          "phone",
          "seatbelt_off",
          "sleeping",
          "smoking",
          "out_of_lane",
          "unsafe_distance",
          "hands_off_wheel",
        ];

        const dailyDatasets = eventTypes.map((eventType, index) => {
          const dailyCounts = Array(getDaysInMonth(displayedMonth)).fill(0);

          allRiskEvents.forEach((event) => {
            const eventDate = new Date(event.timestamp);
            if (
              eventDate.getMonth() === selectedMonth.getMonth() &&
              eventDate.getFullYear() === selectedMonth.getFullYear()
            ) {
              const day = eventDate.getDate();
              if (day >= 1 && day <= dailyCounts.length && event[eventType]) {
                dailyCounts[day - 1]++;
              }
            }
          });

          return {
            label: eventType
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()),
            data: dailyCounts,
            borderColor: colors[index % colors.length],
            backgroundColor: hexToRgba(colors[index % colors.length], 0.15),
            borderWidth: 2,
            tension: 0.5,
            fill: true,
          };
        });

        const daysInMonth = getDaysInMonth(displayedMonth);
        const labels = Array.from({ length: daysInMonth }, (_, i) =>
          String(i + 1).padStart(2, "0")
        );

        setChartData({
          labels,
          datasets: dailyDatasets,
        });
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };

    fetchRiskEvents();
    const interval = setInterval(fetchRiskEvents, 1000);
    return () => clearInterval(interval);
  }, [selectedMonth, displayedMonth]);

  if (!chartData) {
    return (
      <div className="relative w-full p-4 border bg-gray-300 text-card-foreground rounded-xl overflow-hidden animate-pulse ">
        <div className="flex items-center justify-center mb-2 h-[380px]">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full  p-4 border bg-card text-card-foreground shadow rounded-xl overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="success"
          onClick={handlePrevMonth}
          className="p-2 rounded bg-card"
        >
          <FaChevronLeft className="text-card-foreground" />
        </Button>
        <span className="font-bold text-lg">
          {getMonthYearString(displayedMonth)}
        </span>
        <Button
          variant="success"
          onClick={handleNextMonth}
          className="p-2 rounded bg-card"
        >
          <FaChevronRight className="text-card-foreground" />
        </Button>
      </div>
      <div style={{ height: "380px" }}>
        <Line options={options(chartData.labels)} data={chartData} />
      </div>
    </div>
  );
};

export default AllStats;
