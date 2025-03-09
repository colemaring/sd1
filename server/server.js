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
const TRIP_TIMEOUT = 1 * 60 * 1000; // Trips time out after x minutes of no messages (driver activity set to false and trip end_time set to curr time)

const BASE_PCF = 0.50243837;
const SAFETY_SCORE_BASE = 113.96245249;
const SAFETY_SCORE_SCALING = 27.78938322;

const MULTIPLIERS = {
  Drinking: 1.18282601,
  Eating: 1.01,
  Phone: 1.04,
  SeatbeltOff: 1.01500342,
  Sleeping: 1.5,
  Smoking: 1.02,
  OutOfLane: 1.2,
  UnsafeDistance: 1.00431643,
  HandsOnWheel_1: 1.1,
  HandsOnWheel_0: 1.3,
};

const eventFrequencies = new Map(); // To track event frequencies per trip

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

function calculateRiskyDriversMultiplier(riskyDrivers) {
  return 1 + 0.1 * riskyDrivers;
}

function calculatePCF(eventFrequencies) {
  let pcf = BASE_PCF;
  for (const [event, frequency] of Object.entries(eventFrequencies)) {
    if (event === "RiskyDrivers") {
      pcf *= calculateRiskyDriversMultiplier(frequency);
    } else if (MULTIPLIERS[event]) {
      let multiplier = MULTIPLIERS[event];
      let adjustedMultiplier = 1 + (multiplier - 1) * frequency;
      pcf *= adjustedMultiplier;
    }
  }
  return pcf;
}

function calculateSafetyScore(pcf) {
  let score = SAFETY_SCORE_BASE - SAFETY_SCORE_SCALING * pcf;
  return Math.max(0, Math.min(score, 100));
}

// Handles backend application logic
async function handleWebSocketsMessage(message) {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (e) {
    console.error("Failed to parse message:", message);
    return;
  }

  const driverId = await checkIfDriverExistsElseCreate(parsedMessage);
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

    // Ensure eventFrequencies exists for this trip
    if (!eventFrequencies.has(tripId)) {
      eventFrequencies.set(tripId, {});
    }
    let tripEvents = eventFrequencies.get(tripId);

    // Update event frequencies
    for (const [key, value] of Object.entries(parsedMessage)) {
      if (key === "HandsOnWheel") {
        const eventKey = value === 1 ? "HandsOnWheel_1" : "HandsOnWheel_0";
        tripEvents[eventKey] = (tripEvents[eventKey] || 0) + 1;
      } else if (key === "RiskyDrivers" && value > 0) {
        tripEvents["RiskyDrivers"] = (tripEvents["RiskyDrivers"] || 0) + value;
      } else if (typeof value === "boolean" && value) {
        tripEvents[key] = (tripEvents[key] || 0) + 1;
      }
    }

    // Calculate risk score
    const pcf = calculatePCF(tripEvents);
    const safetyScore = calculateSafetyScore(pcf);

    console.log(`Trip Event Frequencies:`, tripEvents);
    console.log(`Calculated PCF: ${pcf}`);
    console.log(`Trip Safety Score: ${safetyScore}`);

    parsedMessage["risk_score"] = Math.round(safetyScore * 100) / 100;

    // Store updated frequencies
    eventFrequencies.set(tripId, tripEvents);

    // Add risk events to trip while trip is active
    await addRiskEvents(tripId, parsedMessage, driverId);

    // End trip if LastFlag is true and update driver's activity
    await endTripIfNeeded(driverId, tripId, parsedMessage);
  }
}

// Set driver activity to false and end trip if no messages received in 10 minutes
async function handleTripTimeout(tripId, driverId) {
  console.log(`Trip ${tripId} timed out after 1 minutes of inactivity.`);

  const tripEvents = eventFrequencies.get(tripId) || {};
  eventFrequencies.delete(tripId);

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

    // Get driver's old risk score
    const driverResponse = await fetch(
      `https://aifsd.xyz/api/drivers/${driverId}`
    );
    if (!driverResponse.ok) {
      console.error("Error getting driver:", await driverResponse.json());
      return;
    }

    const driver = await driverResponse.json();
    console.log("Driver:", driver);
    const oldRiskScore = driver.risk_score;

    if (updateTripResponse.ok) {
      console.log(`Trip ${tripId} ended due to timeout.`);

      // After ending the trip, calculate the risk score from the stored trip events
      const pcf = calculatePCF(tripEvents);
      const safetyScore = Math.round(calculateSafetyScore(pcf) * 100) / 100;

      const updateTripRiskScoreResponse = await fetch(
        `https://aifsd.xyz/api/trip/${tripId}/risk-score`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ risk_score: safetyScore }),
        }
      );

      if (updateTripRiskScoreResponse.ok) {
        console.log(`Trip ${tripId} risk score updated to ${safetyScore}`);
      } else {
        console.error(
          "Failed to update trip risk score:",
          await updateTripRiskScoreResponse.text()
        );
      }

      // Get all trips for this driver to calculate average risk score
      const tripsResponse = await fetch(
        `https://aifsd.xyz/api/trips/driver/${driverId}`
      );
      if (tripsResponse.ok) {
        // If trip is ended due to a timeout and not lastFlag, that means that a risk_score for that trip was never calculated, as our current logic only sends risk_score when the trip is known to be over on the client side
        // since we're forcing the trip to end here, the risk_score is unknown, so for now it will default to 100 (as noted in the database schema file (default 100))
        const trips = await tripsResponse.json();
        // Calculate the average risk score for trips that ended within the past 30 days
        const THIRTY_DAYS_AGO = new Date();
        THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);
        const validTrips = trips.filter(
          (trip) =>
            trip.end_time !== null && new Date(trip.end_time) >= THIRTY_DAYS_AGO
        );
        const totalRiskScore = validTrips.reduce(
          (acc, trip) => acc + Number(trip.risk_score),
          0
        );
        const averageRiskScore =
          validTrips.length > 0 ? totalRiskScore / validTrips.length : 100;

        // Update the previous risk history entry with a to_timestamp
        const prevRiskHistoryResponse = await fetch(
          `https://aifsd.xyz/api/driver_risk_history/driver/${driverId}/end`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ to_timestamp: endTime }),
          }
        );

        if (!prevRiskHistoryResponse.ok) {
          console.error(
            "Error updating previous risk history entry for driverId: " +
              driverId,
            await prevRiskHistoryResponse.text()
          );
        } else {
          console.log(
            "Previous risk history entry's to_timestamp updated successfully for driverId: " +
              driverId
          );
        }

        // Update driver's risk score
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

        // Create a new risk history entry
        if (updateRiskScoreResponse.ok) {
          // Add new risk score entry to driver_risk_history
          const newRiskHistoryResponse = await fetch(
            `https://aifsd.xyz/api/driver_risk_history`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                driver_id: driverId,
                risk_score: averageRiskScore,
                from_timestamp: endTime,
              }),
            }
          );

          if (!newRiskHistoryResponse.ok) {
            console.error(
              "Error adding new risk history entry for driverId:" + driverId,
              await newRiskHistoryResponse.text()
            );
          } else {
            console.log(
              "New risk history entry added successfully for driverId: " +
                driverId
            );
          }
        }

        // Calculate the driver's percent change in risk score between old risk score and new average risk score
        const percentChange =
          ((averageRiskScore - oldRiskScore) / oldRiskScore) * 100;
        console.log("Percent change in risk score:", percentChange);

        // Update the drivers percent change in risk score
        const updatePercentChangeResponse = await fetch(
          `https://aifsd.xyz/api/drivers/${driverId}/percent-change`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ percent_change: percentChange }),
          }
        );

        if (updatePercentChangeResponse.ok) {
          const updatedDriver = await updatePercentChangeResponse.json();
          console.log(
            "Driver's percent change in risk score updated:",
            updatedDriver
          );
        } else {
          console.error(
            "Error updating driver's percent change in risk score:",
            await updatePercentChangeResponse.json()
          );
        }
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
    if (activeTrips.get(tripId)?.timeoutId) {
      clearTimeout(activeTrips.get(tripId).timeoutId);
    }
    activeTrips.delete(tripId);
    eventFrequencies.delete(tripId);

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
          "Error updating trip risk score, maybe lastFlag was true but no risk score was provided. Erorr message:",
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

      // Calculate the average risk score for trips that ended within the past 30 days
      const THIRTY_DAYS_AGO = new Date();
      THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);
      const validTrips = trips.filter(
        (trip) =>
          trip.end_time !== null && new Date(trip.end_time) >= THIRTY_DAYS_AGO
      );
      const totalRiskScore = validTrips.reduce(
        (acc, trip) => acc + Number(trip.risk_score),
        0
      );
      const averageRiskScore =
        validTrips.length > 0 ? totalRiskScore / validTrips.length : 100;
      console.log("Average risk score:", averageRiskScore);

      // Get driver's old risk score
      const driverResponse = await fetch(
        `https://aifsd.xyz/api/drivers/${driverId}`
      );
      if (!driverResponse.ok) {
        console.error("Error getting driver:", await driverResponse.json());
        return;
      }
      const driver = await driverResponse.json();
      console.log("Driver:", driver);
      const oldRiskScore = driver.risk_score;

      // Update driver's risk score using the average of all trip risk scores
      if (updatedTrip.risk_score !== undefined) {
        // Update the previous risk history entry with a to_timestamp
        const prevRiskHistoryResponse = await fetch(
          `https://aifsd.xyz/api/driver_risk_history/driver/${driverId}/end`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ to_timestamp: endTime }),
          }
        );

        if (!prevRiskHistoryResponse.ok) {
          console.error(
            "Error updating previous risk history entry:",
            await prevRiskHistoryResponse.json()
          );
        } else {
          console.log(
            "Previous risk history entry's to_timestamp updated:",
            await prevRiskHistoryResponse.json()
          );
        }

        // Update driver's risk score
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

          // Add new risk score entry to driver_risk_history
          const newRiskHistoryResponse = await fetch(
            `https://aifsd.xyz/api/driver_risk_history`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                driver_id: driverId,
                risk_score: averageRiskScore,
                from_timestamp: endTime,
              }),
            }
          );

          if (!newRiskHistoryResponse.ok) {
            console.error(
              "Error adding new risk history entry:",
              await newRiskHistoryResponse.json()
            );
          } else {
            console.log(
              "New risk history entry added:",
              await newRiskHistoryResponse.json()
            );
          }
        } else {
          console.error(
            "Error updating driver's risk score:",
            await updateRiskScoreResponse.json()
          );
        }

        // Calculate the driver's percent change in risk score between old risk score and new average risk score
        const percentChange =
          ((averageRiskScore - oldRiskScore) / oldRiskScore) * 100;
        console.log("Percent change in risk score:", percentChange);

        //Update the drivers percent change in risk score
        const updatePercentChangeResponse = await fetch(
          `https://aifsd.xyz/api/drivers/${driverId}/percent-change`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ percent_change: percentChange }),
          }
        );

        if (updatePercentChangeResponse.ok) {
          const updatedDriver = await updatePercentChangeResponse.json();
          console.log(
            "Driver's percent change in risk score updated:",
            updatedDriver
          );
        } else {
          console.error(
            "Error updating driver's percent change in risk score:",
            await updatePercentChangeResponse.json()
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

      const createdDriverId = createdDriver.id;
      const defaultRiskScore = 100;
      const currentTime = new Date().toISOString();

      // Add default risk score entry to driver_risk_history for new driver
      const newRiskHistoryResponse = await fetch(
        `https://aifsd.xyz/api/driver_risk_history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: createdDriverId,
            risk_score: defaultRiskScore,
            from_timestamp: currentTime,
          }),
        }
      );

      if (!newRiskHistoryResponse.ok) {
        console.error(
          "Error adding new risk history entry:",
          await newRiskHistoryResponse.json()
        );
      } else {
        console.log(
          "New risk history entry added:",
          await newRiskHistoryResponse.json()
        );
      }

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
