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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        font: {
          size: 12,
          family: "'Arial', sans-serif",
          weight: "bold",
        },
      },
    },
    tooltip: {
      backgroundColor: "hsl(var(--primary))",
      titleFont: { weight: "bold" },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Event Type",
      },
    },
    y: {
      title: {
        display: true,
        text: "Frequency",
      },
    },
  },
};

const AllStats = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchRiskEvents = async () => {
      try {
        const response = await fetch("https://aifsd.xyz/api/risk-events");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Process data to get frequency of each event type
        const eventFrequency = data.reduce((acc, event) => {
          Object.keys(event).forEach((key) => {
            if (event[key] === true) {
              acc[key] = (acc[key] || 0) + 1;
            }
          });
          return acc;
        }, {});

        const labels = Object.keys(eventFrequency);
        const frequencies = Object.values(eventFrequency);

        setChartData({
          labels,
          datasets: [
            {
              label: "Event Frequency",
              data: frequencies,
              fill: true,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };

    fetchRiskEvents();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full md:max-w-6xl p-4 border bg-card text-card-foreground shadow rounded-xl overflow-hidden">
      <div style={{ height: "380px" }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default AllStats;
