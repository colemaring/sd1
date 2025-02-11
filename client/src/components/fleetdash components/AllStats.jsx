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

export const options = {
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
      labels: Array.from({ length: 30 }, (_, i) =>
        String(i + 1).padStart(2, "0")
      ),
      grid: {
        display: false,
      },
    },
    y: {
      title: { display: false },
      grid: { display: false },
    },
  },
};

const AllStats = () => {
  const [chartData, setChartData] = useState(null);
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

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

        // Define event types to count per day
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
          const dailyCounts = Array(30).fill(0);

          allRiskEvents.forEach((event) => {
            const eventDate = new Date(event.timestamp);
            if (
              eventDate.getMonth() === selectedMonth.getMonth() &&
              eventDate.getFullYear() === selectedMonth.getFullYear()
            ) {
              const day = eventDate.getDate();
              if (day >= 1 && day <= 30 && event[eventType]) {
                dailyCounts[day - 1]++;
              }
            }
          });

          return {
            label: eventType,
            data: dailyCounts,
            borderColor: colors[index % colors.length],
            backgroundColor: hexToRgba(colors[index % colors.length], 0.15),
            borderWidth: 2,
            tension: 0.5,
            fill: true, // enable area fill
          };
        });

        setChartData({
          labels: Array.from({ length: 30 }, (_, i) =>
            String(i + 1).padStart(2, "0")
          ),
          datasets: dailyDatasets,
        });
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };

    fetchRiskEvents();
  }, [selectedMonth]);

  if (!chartData) {
    return <div>Loading...</div>;
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
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default AllStats;
