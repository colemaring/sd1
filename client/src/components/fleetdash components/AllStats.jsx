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
      stacked: true,
      title: {
        display: false,
      },
      grid: {
        display: false,
      },
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
        const data = await response.json();

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

        const datasets = eventTypes.map((eventType, index) => {
          const dailyCounts = Array(30).fill(0);

          data.forEach((event) => {
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

          const backgroundColor = colors[index % colors.length].replace(
            /[^,]+(?=\))/,
            "0.5"
          );
          return {
            label: eventType,
            data: dailyCounts,
            backgroundColor: backgroundColor,
            borderColor: colors[index % colors.length],
            borderWidth: 2,
            fill: true,
            stack: "1",
            tension: 0.5,
          };
        });

        setChartData({
          labels: Array.from({ length: 30 }, (_, i) =>
            String(i + 1).padStart(2, "0")
          ),
          datasets: datasets,
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
    <div className="relative w-full md:max-w-6xl p-4 border bg-card text-card-foreground shadow rounded-xl overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded bg-gray-200">
          <FaChevronLeft />
        </button>
        <span className="font-bold text-lg">
          {getMonthYearString(displayedMonth)}
        </span>
        <button onClick={handleNextMonth} className="p-2 rounded bg-gray-200">
          <FaChevronRight />
        </button>
      </div>
      <div style={{ height: "380px" }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default AllStats;
