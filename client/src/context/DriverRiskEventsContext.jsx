import React, { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCallback } from "react";

export const DriverRiskEventsContext = createContext();

export const DriverRiskEventsProvider = ({ children, selectedFilters }) => {
  const { driverPhone } = useParams();
  const [riskEvents, setRiskEvents] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (!driverPhone) return;

    const fetchRiskEvents = async () => {
      try {
        const tripsResponse = await fetch(
          `https://aifsd.xyz/api/trips/${driverPhone}`
        );
        const trips = await tripsResponse.json();
        const tripIds = trips.map((trip) => trip.id);

        const riskEventsResponse = await fetch(
          `https://aifsd.xyz/api/risk-events-id`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tripIds }),
          }
        );
        const riskEvents = await riskEventsResponse.json();
        setRiskEvents(riskEvents);
      } catch (error) {
        console.error("Error fetching risk events:", error);
      }
    };

    fetchRiskEvents();
  }, [driverPhone, selectedFilters, update]);

  const updateRiskEvents = useCallback(() => {
    setUpdate((prevUpdate) => !prevUpdate);
  }, []);

  return (
    <DriverRiskEventsContext.Provider value={{ riskEvents, updateRiskEvents }}>
      {children}
    </DriverRiskEventsContext.Provider>
  );
};
