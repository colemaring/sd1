const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const fs = require("fs");

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

// Serve static files from the dist folder in the client directory
app.use(express.static("../client/dist"));

// For all routes, return index.html from the dist folder
app.get("*", (req, res) => {
  res.sendFile( "/root/sd1/client/dist/index.html");
});

httpsServer.listen(443, () => {
  console.log("Server started on port 443");
});

// exists only to redirect http to https
httpServer.listen(80, () => {
  console.log("HTTP redirect server started on port 80");
});
