import React, { createContext, useEffect, useState } from "react";

export const WebSocketsContext = createContext();

export const WebSocketsProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // use ws://localhost:8080 if local
    // wss://aifsd.xyz for deployed
    const ws = new WebSocket("wss://aifsd.xyz");

    ws.onopen = () => {
      console.log("Connected to the server");
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [newMessage.Driver]: newMessage,
      }));
    };

    ws.onclose = () => {
      console.log("Disconnected from the server");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketsContext.Provider value={messages}>
      {children}
    </WebSocketsContext.Provider>
  );
};
