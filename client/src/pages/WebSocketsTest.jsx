import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const WebSocketsTest = () => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://aifsd.xyz");

    ws.onopen = () => {
      console.log("Connected to the server");
    };

    ws.onmessage = (event) => {
      setMessage(JSON.parse(event.data));
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
      <h1>WebSocket Message</h1>
      {message && <pre>{JSON.stringify(message, null, 2)}</pre>}
    </div>
  );
};

export default WebSocketsTest;
