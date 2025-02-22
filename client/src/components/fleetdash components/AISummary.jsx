import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMagic } from "react-icons/fa";

const AISummary = () => {
  const { driverPhone } = useParams(); // Get phone number from URL
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchAISummary = async () => {
      try {
        const response = await fetch(
          `https://aifsd.xyz/api/risk-events-summary/${driverPhone}`
        );
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error("Error fetching AI summary:", error);
      }
    };

    if (driverPhone) {
      fetchAISummary();
    }
  }, [driverPhone]);

  return (
    <div
      style={{ height: "23vh" }}
      className="border col-span-12 md:col-span-6 lg:col-span-3 bg-card shadow rounded-xl p-3 m-4"
    >
      <div className="flex items-center mb-2">
        <FaMagic className="mr-2" />
        <h2 className="font-medium">AI Summary</h2>
      </div>
      <p>{summary || "Loading AI summary..."}</p>
    </div>
  );
};

export default AISummary;
