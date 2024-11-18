const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");

const db = require('./db');
const api = require("./api");

const isDev = process.argv.includes("dev");

let httpsServer, httpServer;

if (!isDev) {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/aifsd.xyz/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/aifsd.xyz/fullchain.pem"),
  };

  // init https server
  const httpsServer = https.createServer(options, app);

  // Create an HTTP server to redirect to HTTPS
  const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  });

  httpsServer.listen(443, () => {
    console.log("Server started on port 443");
  });

  // exists only to redirect http to https
  httpServer.listen(80, () => {
    console.log("HTTP redirect server started on port 80");
  });

  let wss = new WebSocket.Server({ server: httpsServer });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
      console.log(`Received message => ${message}`);
      let jsonMessage;
      try {
        jsonMessage = JSON.parse(message);
      } catch (e) {
        console.error("Invalid JSON received:", message);
        return;
      }

      const jsonString = JSON.stringify(jsonMessage);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(jsonString);
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
} else {
  // dev server
  httpServer = http.createServer(app);

  httpServer.listen(8080, () => {
    console.log("Development server started on port 8080");
  });
}

app.use(express.json());

app.use("/api", api);

// Serve static files from the dist folder in the client directory
app.use(express.static("../client/dist"));

// For all routes, return index.html from the dist folder
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
