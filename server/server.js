const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const fs = require("fs");
require("dotenv").config();

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

// Render built react files
app.use(express.static("dist"));

// for all routes, return index.html
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// serve maps api key
app.get("/api/config", (req, res) => {
  res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
});

httpsServer.listen(443, () => {
  console.log("Server started on port 443");
});

// exists only to redirect http to https
httpServer.listen(80, () => {
  console.log("HTTP redirect server started on port 80");
});
