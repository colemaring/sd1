import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const WebSocketsTest = () => {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const ws = new WebSocket("wss://aifsd.xyz");

    ws.onopen = () => {
      console.log("Connected to the server");
    };

    // each unique driver will have its own message rendered
    // implies that driver names are unique
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
    <div>
      <NavBar />
      <h1>WebSocket Messages</h1>
      {Object.keys(messages).map((driver, index) => (
        <div key={index}>
          <h2>Driver: {driver}</h2>
          <pre>{JSON.stringify(messages[driver], null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default WebSocketsTest;
