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
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        font: {
          size: 14,
          family: "'Arial', sans-serif",
          weight: "bold",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgb(240 240 240)",
      titleFont: { weight: "bold" },
      bodyFont: { size: 12 },
      borderColor: "rgba(255, 255, 255, 0.5)",
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Days",
        font: { size: 16 },
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: "Occurences",
        font: { size: 16 },
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
    <div className=" bg-[#f0f0f0] rounded-xl">
      <h1 className="text-center text-2xl font-bold py-4 text-gray-800">
        Fleet Risk Score Overview
      </h1>
      <Line options={options} data={data} className="relative" />
    </div>
  );
}

export default AllStats;
