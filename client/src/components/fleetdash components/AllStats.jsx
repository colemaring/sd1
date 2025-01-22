import React from "react";
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
import mockData from "../../data/mockdata";

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
      bodyFont: { size: 10 },
      borderColor: "rgba(255, 255, 255, 0.5)",
      borderWidth: 1,
      padding: 8,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Days",
        font: { size: 12 },
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: "Occurrences",
        font: { size: 12 },
      },
      grid: {
        color: "rgba(200, 200, 200, 0.3)",
      },
    },
  },
};

const labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

export const data = {
  labels,
  datasets: mockData,
};

function AllStats() {
  return (
    <div className="bg-card rounded-xl p-4">
      <h1 className="text-center text-xl font-bold pb-4 text-primary">
        Fleet Risk Score Overview
      </h1>
      <div className="relative h-64 sm:h-80">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default AllStats;
