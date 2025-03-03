const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
app.use(cors());

const db = require("./db");
const api = require("./api");

const isDev = process.argv.includes("dev");

let httpsServer, httpServer;
const activeTrips = new Map(); // Map to store active trips and their last message timestamp
const TRIP_TIMEOUT = 10 * 60 * 1000; // Trips time out after x minutes of no messages (driver activity set to false and trip end_time set to curr time)

if (!isDev) {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/aifsd.xyz/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/aifsd.xyz/fullchain.pem"),
  };

  // init https server
  httpsServer = https.createServer(options, app);

  // Create an HTTP server to redirect to HTTPS
  httpServer = http.createServer((req, res) => {
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
      // console.log(`Received message => ${message}`);
      let jsonMessage;
      try {
        jsonMessage = JSON.parse(message);
      } catch (e) {
        console.error("Invalid JSON received:", message);
        return;
      }

      const jsonString = JSON.stringify(jsonMessage);
      handleWebSocketsMessage(jsonString);
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

  let wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
      // console.log(`Received message => ${message}`);
      let jsonMessage;
      try {
        jsonMessage = JSON.parse(message);
      } catch (e) {
        console.error("Invalid JSON received:", message);
        return;
      }

      const jsonString = JSON.stringify(jsonMessage);
      handleWebSocketsMessage(jsonString);

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
}

// Handles backend application logic
async function handleWebSocketsMessage(message) {
  // console.log("Received message:", message + " handlewebsocketsmessage");

  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (e) {
    console.error("Failed to parse message:", message);
    return;
  }
  // Get driverId of messages coming in
  const driverId = await checkIfDriverExistsElseCreate(parsedMessage);
  // console.log("Message recieved with driverId: ", driverId);

  // Get tripId of messages coming in and update driver's activity
  const tripId = await checkIfTripExistsElseCreate(driverId, parsedMessage);
  if (tripId) {
    // Record timestamp of message for this trip
    activeTrips.set(tripId, {
      lastMessageTime: Date.now(),
      driverId: driverId,
      timeoutId: activeTrips.get(tripId)?.timeoutId,
    });

    // Clear any existing timeout for this trip
    if (activeTrips.get(tripId)?.timeoutId) {
      clearTimeout(activeTrips.get(tripId).timeoutId);
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      handleTripTimeout(tripId, driverId);
    }, TRIP_TIMEOUT);

    // Update the timeout ID in the Map
    activeTrips.set(tripId, {
      ...activeTrips.get(tripId),
      timeoutId: timeoutId,
    });

    // Add risk events to trip while trip is active
    await addRiskEvents(tripId, parsedMessage, driverId);

    // End trip if LastFlag is true and update driver's activity
    await endTripIfNeeded(driverId, tripId, parsedMessage);
  }
}

// Set driver activity to false and end trip if no messages received in 10 minutes
async function handleTripTimeout(tripId, driverId) {
  console.log(`Trip ${tripId} timed out after 10 minutes of inactivity.`);

  // Get trip data to check if it's already ended
  try {
    const tripResponse = await fetch(`https://aifsd.xyz/api/trip/${tripId}`);
    if (!tripResponse.ok) {
      console.error("Error fetching trip data:", await tripResponse.text());
      return;
    }

    const tripData = await tripResponse.json();
    if (tripData.end_time) {
      console.log(`Trip ${tripId} was already ended.`);
      activeTrips.delete(tripId);
      return;
    }

    // End the trip
    const endTime = new Date().toISOString();
    const updateTripResponse = await fetch(
      `https://aifsd.xyz/api/trip/${tripId}/end`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ end_time: endTime }),
      }
    );

    if (updateTripResponse.ok) {
      console.log(`Trip ${tripId} ended due to timeout.`);

      // Get all trips for this driver to calculate average risk score
      const tripsResponse = await fetch(
        `https://aifsd.xyz/api/trips/driver/${driverId}`
      );
      if (tripsResponse.ok) {
        // If trip is ended due to a timeout and not lastFlag, that means that a risk_score for that trip was never calculated, as our current logic only sends risk_score when the trip is known to be over on the client side
        // since we're forcing the trip to end here, the risk_score is unknown, so for now it will default to 100 (as noted in the database schema file (default 100))
        const trips = await tripsResponse.json();
        const validTrips = trips.filter((trip) => trip.end_time !== null);
        const totalRiskScore = validTrips.reduce(
          (acc, trip) => acc + Number(trip.risk_score),
          0
        );
        const averageRiskScore = validTrips.length
          ? totalRiskScore / validTrips.length
          : 100;

        // Update driver's risk score
        await fetch(`https://aifsd.xyz/api/drivers/${driverId}/risk-score`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ risk_score: averageRiskScore }),
        });
      }

      // Set driver as inactive
      await fetch(`https://aifsd.xyz/api/driver/${driverId}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });
    } else {
      console.error(
        "Error ending trip due to timeout:",
        await updateTripResponse.text()
      );
    }
  } catch (error) {
    console.error("Error handling trip timeout:", error);
  }

  // Clean up the trip from our active trips map
  activeTrips.delete(tripId);
}

async function addRiskEvents(tripId, parsedMessage, driverId) {
  // Map parsedMessage to risk_event columns
  const {
    Timestamp: timestamp,
    Drinking: drinking,
    Eating: eating,
    OnPhone: phone,
    SeatbeltOff: seatbelt_off,
    Sleeping: sleeping,
    Smoking: smoking,
    OutOfLane: out_of_lane,
    RiskyDrivers: risky_drivers,
    UnsafeDistance: unsafe_distance,
    HandsOffWheel: hands_off_wheel,
  } = parsedMessage;

  const riskEvent = {
    trip_id: tripId, // Ref tripId
    timestamp,
    drinking,
    eating,
    phone,
    seatbelt_off,
    sleeping,
    smoking,
    out_of_lane,
    risky_drivers,
    unsafe_distance,
    hands_off_wheel,
  };

  try {
    const response = await fetch("https://aifsd.xyz/api/risk-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(riskEvent),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(
        "Risk event received for driverId: " + driverId + " and trip: " + tripId
      );
      //console.log("Risk event added", result);
    } else {
      console.error("Error adding risk event:", await response.json());
    }
  } catch (error) {
    console.error("Error adding risk event:", error);
  }
}

async function endTripIfNeeded(driverId, tripId, parsedMessage) {
  if (parsedMessage.LastFlag) {
    // Clear any timeout for this trip and remove from active trips map
    if (activeTrips.get(tripId)?.timeoutId) {
      clearTimeout(activeTrips.get(tripId).timeoutId);
    }
    activeTrips.delete(tripId);

    const endTime = new Date().toISOString();

    // Update trip end time
    const updateTripResponse = await fetch(
      `https://aifsd.xyz/api/trip/${tripId}/end`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ end_time: endTime }),
      }
    );

    if (updateTripResponse.ok) {
      const updatedTrip = await updateTripResponse.json();
      console.log("Trip end time set to current time:", updatedTrip);

      // Update trip risk score
      const updateTripRiskScoreResponse = await fetch(
        `https://aifsd.xyz/api/trip/${tripId}/risk-score`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ risk_score: parsedMessage.risk_score }),
        }
      );

      if (!updateTripRiskScoreResponse.ok) {
        console.error(
          "Error updating trip risk score:",
          await updateTripRiskScoreResponse.json()
        );
      }

      const updatedTripRiskScore = await updateTripRiskScoreResponse.json();
      console.log("Trip risk score updated:", updatedTripRiskScore);

      // Get all trips for this driver
      const tripsResponse = await fetch(
        `https://aifsd.xyz/api/trips/driver/${driverId}`
      );
      if (!tripsResponse.ok) {
        console.error(
          "Error getting trips for driver:",
          await tripsResponse.json()
        );
        return;
      }
      const trips = await tripsResponse.json();

      // Find the average of the risk scores of all trips with a valid end time for this driver
      const validTrips = trips.filter((trip) => trip.end_time !== null);
      const totalRiskScore = validTrips.reduce(
        (acc, trip) => acc + Number(trip.risk_score),
        0
      );
      const averageRiskScore = totalRiskScore / validTrips.length;
      console.log("Average risk score:", averageRiskScore);

      // Update driver's risk score using the average of all trip risk scores
      if (updatedTrip.risk_score !== undefined) {
        // TODO: Update driver's current risk score in driver_risk_history with to_timestamp

        const updateRiskScoreResponse = await fetch(
          `https://aifsd.xyz/api/drivers/${driverId}/risk-score`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ risk_score: averageRiskScore }),
          }
        );

        if (updateRiskScoreResponse.ok) {
          const updatedDriver = await updateRiskScoreResponse.json();
          console.log("Driver's risk score updated:", updatedDriver);

          // TODO: Add new risk score to driver_risk_history
        } else {
          console.error(
            "Error updating driver's risk score:",
            await updateRiskScoreResponse.json()
          );
        }
      }
    } else {
      console.error(
        "Error setting trip end time:",
        await updateTripResponse.json()
      );
    }

    // Set the driver's active status to false
    const updateDriverResponse = await fetch(
      `https://aifsd.xyz/api/driver/${driverId}/active`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      }
    );

    if (updateDriverResponse.ok) {
      const updatedDriver = await updateDriverResponse.json();
      console.log("Driver's active status set to false:", updatedDriver);
    } else {
      console.error(
        "Error setting driver's active status:",
        await updateDriverResponse.json()
      );
    }
  }
}

async function checkIfTripExistsElseCreate(driverId, parsedMessage) {
  // Check if driverId has a current trip
  const response = await fetch("https://aifsd.xyz/api/trips");
  const trips = await response.json();
  const currentTrip = trips
    .filter((trip) => trip.driver_id === driverId)
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))[0];
  //console.log("Current trip:", currentTrip);

  if (parsedMessage.FirstFlag) {
    // not specifying risk_score will default it to 0
    // end_time will be null as we just started a trip
    const newTrip = {
      driver_id: driverId,
      start_time: new Date().toISOString(),
    };

    const createResponse = await fetch("https://aifsd.xyz/api/trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    });

    if (createResponse.ok) {
      const createdTrip = await createResponse.json();

      // Set the driver's active status to true
      const updateResponse = await fetch(
        `https://aifsd.xyz/api/driver/${driverId}/active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: true }),
        }
      );

      if (updateResponse.ok) {
        const updatedDriver = await updateResponse.json();
        console.log("Driver's active status set to true:", updatedDriver);
      } else {
        console.error(
          "Error setting driver's active status:",
          await updateResponse.json()
        );
      }

      console.log("New trip created:", createdTrip);
      return createdTrip.id; // Return the ID of the newly created trip
    } else {
      console.error("Error creating new trip:", await createResponse.json());
      return null;
    }
  } else {
    if (currentTrip) {
      // console.log("trip with this driver id already exists");
      return currentTrip.id;
    } else {
      console.log("no trip exists and firstflag was false");
      return null;
    }
  }
}

async function checkIfDriverExistsElseCreate(message) {
  // Check if driver with that phone number exists in the drivers table
  const response = await fetch("https://aifsd.xyz/api/drivers");
  const drivers = await response.json();
  const existingDriver = drivers.find(
    (driver) =>
      String(driver.phone_number).trim() === String(message.Phone).trim()
  );

  if (!existingDriver) {
    // No driver found with that phone number, create a new one
    const newDriver = {
      name: message.Driver,
      phone_number: message.Phone,
      risk_score: 100, // starts at 100 if driver has not yet driven
      fleet_id: 1, // Hardcode at 1 for now
    };

    const createResponse = await fetch("https://aifsd.xyz/api/driver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDriver),
    });

    if (createResponse.ok) {
      const createdDriver = await createResponse.json();
      console.log("New driver created:", createdDriver);
      return createdDriver.id; // Return the ID of the newly created driver
    } else {
      console.error("Error creating new driver:", await createResponse.json());
      return null;
    }
  } else {
    // console.log(
    //   "Driver with this phone number already exists:",
    //   existingDriver
    // );
    return existingDriver.id; // Return the ID of the existing driver
  }
}

app.use(express.json());

app.use("/api", api);

// Serve static files from the dist folder in the client directory
app.use(express.static("../client/dist"));

// For all routes, return index.html from the dist folder
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
