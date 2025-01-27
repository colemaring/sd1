import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import { WebSocketsContext } from "../context/WebSocketsContext";

const WebSocketsTest = () => {
  const messages = useContext(WebSocketsContext);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-muted">
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
