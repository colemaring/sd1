import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMagic } from "react-icons/fa";

const AISummary = () => {
  const { driverPhone } = useParams(); // Get phone number from URL
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAISummary = async () => {
      try {
        const response = await fetch(
          `https://aifsd.xyz/api/risk-events-summary/${driverPhone}`
        );
        setIsLoading(true);
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error("Error fetching AI summary:", error);
      }
    };

    if (driverPhone) {
      setIsLoading(false);
      fetchAISummary();
    }
  }, [driverPhone]);

  if (!isLoading) {
    return (
      <div className="h-[215px] rounded-xl bg-gray-300 animate-pulse col-span-12 md:col-span-6 lg:col-span-3 m-4 text-center content-center">
        <p className="font-bold">Loading summary</p>
      </div>
    );
  }

  return (
    <div className="border col-span-12 md:col-span-6 lg:col-span-3 bg-card shadow rounded-xl p-3 pb-4 m-4 overflow-y-scroll h-[215px]">
      {/* Sticky header */}

      <div className="flex items-center mb-2 sticky bg-white pt-2 top-0 w-full z-10">
        <FaMagic className="mr-2" />
        <h2 className="font-medium">AI Summary</h2>
      </div>

      {/* AI Summary Content */}
      <p>{summary}</p>
    </div>
  );
};

export default AISummary;
