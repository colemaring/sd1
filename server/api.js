const express = require("express");
const router = express.Router();
const db = require("./db");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// CREATE
// Create a driver
router.post("/driver", async (req, res) => {
  const { name, phone_number, risk_score, fleet_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO driver (name, phone_number, risk_score, fleet_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, phone_number, risk_score, fleet_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a risk event
router.post("/risk-events", async (req, res) => {
  // Verbose mapping for debugging purposes
  const {
    trip_id,
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
  } = req.body;

  const columns = [
    "trip_id",
    "timestamp",
    "drinking",
    "eating",
    "phone",
    "seatbelt_off",
    "sleeping",
    "smoking",
    "out_of_lane",
    "risky_drivers",
    "unsafe_distance",
    "hands_off_wheel",
  ];

  const values = [
    trip_id,
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
  ];

  const placeholders = columns.map((_, i) => `$${i + 1}`);

  try {
    const result = await db.query(
      `INSERT INTO risk_event (${columns.join(", ")}) 
              VALUES (${placeholders.join(", ")}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a trip
router.post("/trip", async (req, res) => {
  const { driver_id, start_time } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO trip (driver_id, start_time) 
              VALUES ($1, $2) RETURNING *`,
      [driver_id, start_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a risk score in driver risk history
router.post("/driver_risk_history", async (req, res) => {
  const { driver_id, risk_score, from_timestamp } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO driver_risk_history (driver_id, risk_score, from_timestamp, to_timestamp) 
       VALUES ($1, $2, $3, NULL) RETURNING *`,
      [driver_id, risk_score, from_timestamp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH
// Update a driver's current risk score in driver risk history with to timestamp
router.patch("/driver_risk_history/driver/:driver_id/end", async (req, res) => {
  const { driver_id } = req.params;
  const { to_timestamp } = req.body;
  try {
    // Find the most recent active risk history entry
    const result = await db.query(
      `SELECT id 
       FROM driver_risk_history 
       WHERE driver_id = $1 AND to_timestamp IS NULL 
       ORDER BY from_timestamp DESC 
       LIMIT 1`,
      [driver_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Active risk history entry not found" });
    }

    const riskHistoryId = result.rows[0].id;

    // Update the found entry's to_timestamp
    const updateResult = await db.query(
      `UPDATE driver_risk_history 
       SET to_timestamp = $1 
       WHERE id = $2 
       RETURNING *`,
      [to_timestamp, riskHistoryId]
    );

    res.status(200).json(updateResult.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a driver's active status
router.patch("/driver/:id/active", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  try {
    const result = await db.query(
      `UPDATE driver SET active = $1 WHERE id = $2 RETURNING *`,
      [active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a trip's end time
router.patch("/trip/:id/end", async (req, res) => {
  const { id } = req.params;
  const { end_time } = req.body;
  try {
    const result = await db.query(
      `UPDATE trip SET end_time = $1 WHERE id = $2 RETURNING *`,
      [end_time, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a trip's risk score
router.patch("/trip/:id/risk-score", async (req, res) => {
  const { id } = req.params;
  const { risk_score } = req.body;

  if (typeof risk_score !== "number") {
    return res.status(400).json({ error: "Invalid risk score" });
  }

  try {
    const result = await db.query(
      `UPDATE trip SET risk_score = $1 WHERE id = $2 RETURNING *`,
      [risk_score, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a driver's risk score
router.patch("/drivers/:id/risk-score", async (req, res) => {
  const { id } = req.params;
  const { risk_score } = req.body;
  // console.log(risk_score);

  // Validate risk_score is present and is a number
  if (risk_score === undefined || typeof risk_score !== "number") {
    return res.status(400).json({ error: "Valid risk_score is required" });
  }

  try {
    const result = await db.query(
      `UPDATE driver SET risk_score = $1 WHERE id = $2 RETURNING *`,
      [risk_score, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json({
      message: "Risk score updated successfully",
      driver: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating driver risk score:", err);
    res.status(500).json({
      error: "Failed to update risk score",
      details: err.message,
    });
  }
});

// READ
// Read dispatcher by phone number
router.get("/dispatchers/phone/:phone_number", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM dispatchers WHERE phone_number = $1`,
      [req.params.phone_number]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get risk score history for a driver
router.get("/driver_risk_history/driver/:driver_id", async (req, res) => {
  const { driver_id } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM driver_risk_history 
       WHERE driver_id = $1 
       ORDER BY from_timestamp DESC`,
      [driver_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching driver risk history:", err);
    res.status(500).json({
      error: "Failed to retrieve risk history",
      details: err.message,
    });
  }
});

// Read a trip by ID
router.get("/trip/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`SELECT * FROM trip WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ error: err.message });
  }
});

// Read the 100 most recent risk events and generate a summary using Google's Gemini API
router.get("/risk-events-summary/:driverPhone", async (req, res) => {
  const { driverPhone } = req.params;

  try {
    // Fetch the driver ID and name using the phone number
    const driverResult = await db.query(
      `SELECT id, name FROM driver WHERE phone_number = $1`,
      [driverPhone]
    );
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    const driverId = driverResult.rows[0].id;
    const driverName = driverResult.rows[0].name;

    // Fetch the trip IDs for the driver
    const tripResult = await db.query(
      `SELECT id FROM trip WHERE driver_id = $1`,
      [driverId]
    );
    const tripIds = tripResult.rows.map((row) => row.id);

    if (tripIds.length === 0) {
      return res.status(404).json({ error: "No trips found for the driver" });
    }

    // Fetch the risk events for the trip IDs
    const riskEventsResult = await db.query(
      `SELECT * FROM risk_event WHERE trip_id = ANY($1::int[]) ORDER BY timestamp DESC LIMIT 100`,
      [tripIds]
    );
    const riskEvents = riskEventsResult.rows;

    // Generate a summary using Google's Gemini API
    const prompt = generatePrompt(driverName, riskEvents);
    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text().trim();

    res.json({ summary: aiSummary });
  } catch (err) {
    console.error(
      "Error fetching risk events or generating summary:",
      err.message
    );
    res.status(500).json({
      error:
        "Internal server error while fetching risk events or generating summary",
      details: err.message,
    });
  }
});

const generatePrompt = (driverName, riskEvents) => {
  // console.log("riskEvents", riskEvents);
  return `
    Given ${driverName} ‘s risk events (listed below), identify the top two most prevalent patterns in their risky driving. Format your response in two sentences for fleet managers as: 'Name Here tends to exhibit [risk behavior] after [time period/event]' and 'Name Here also frequently [another risk behavior] when [time period/event]'. This information will be used to improve driver safety. These risk events are from a system which provides fleet managers with insights into how their drivers are driving. The response should include some information about their tendencies and behaviors. Your response should be brief and be able to quickly tell the reader the tendencies of this driver. Respond only with the short 2 sentence summary, and nothing else.

    Risk Events:
    ${JSON.stringify(riskEvents, null, 2)}
  `;
};

// Read fleet by dispatcher ID
router.get("/fleets/dispatcher/:dispatcher_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM fleets WHERE dispatcher_id = $1`,
      [req.params.dispatcher_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all drivers
router.get("/drivers", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM driver`);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all trips
router.get("/trips", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM trip`);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read trips for a given driver by phone number
router.get("/trips/:phone_number", async (req, res) => {
  const { phone_number } = req.params;
  try {
    const driverResult = await db.query(
      `SELECT id FROM driver WHERE phone_number = $1`,
      [phone_number]
    );
    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    const driverId = driverResult.rows[0].id;
    const tripResult = await db.query(
      `SELECT * FROM trip WHERE driver_id = $1`,
      [driverId]
    );
    res.json(tripResult.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read trips for a given driver by driver ID
router.get("/trips/driver/:driver_id", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM trip WHERE driver_id = $1`, [
      req.params.driver_id,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all vehicles with a risk score of x or higher
router.get("/vehicles/risk-score/:threshold", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM vehicles WHERE risk_score >= $1`,
      [req.params.threshold]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read vehicle by driver phone number
router.get("/vehicles/phone/:phone_number", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM vehicles WHERE driver_phone_number = $1`,
      [req.params.phone_number]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all risk events with driver and vehicle details
router.get("/risk-events-details", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        re.*, 
        d.name AS driver_name, 
        d.phone_number 
      FROM risk_event re
      JOIN trip t ON re.trip_id = t.id
      JOIN driver d ON t.driver_id = d.id
      ORDER BY re.timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all risk events
router.get("/risk-events", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM risk_event`);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read risk events for a given tripId
router.post("/risk-events-id", async (req, res) => {
  const { tripIds } = req.body;
  if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing tripIds" });
  }

  try {
    const result = await db.query(
      `SELECT * FROM risk_event WHERE trip_id = ANY($1::int[])`,
      [tripIds]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching risk events:", err.message);
    res.status(500).json({
      error: "Internal server error while fetching risk events",
      details: err.message,
    });
  }
});

// Read all risk events for a given vehicle
router.get("/risk-events/vehicle/:vehicle_id", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM risk_events WHERE vehicle_id = $1`,
      [req.params.vehicle_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read risk event by vehicle ID and timestamp
router.get("/risk-events/:vehicle_id/:timestamp", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM risk_events 
            WHERE vehicle_id = $1 AND timestamp = $2`,
      [req.params.vehicle_id, req.params.timestamp]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
// Delete a vehicle
router.delete("/vehicles/:id", async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length) {
      res.json({ message: "Vehicle deleted", vehicle: result.rows[0] });
    } else {
      res.status(404).json({ error: "Vehicle not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a risk event
router.delete("/risk-events/:id", async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM risk_events WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length) {
      res.json({ message: "Risk event deleted", riskEvent: result.rows[0] });
    } else {
      res.status(404).json({ error: "Risk event not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a driver and all associated data
router.delete("/drivers/:phone_number", async (req, res) => {
  const { phone_number } = req.params;
  const { password } = req.headers; // Get password from request headers

  // Check if password is provided
  if (!password) {
    return res.status(401).json({ error: "Password is required" });
  }

  // Verify password matches environment variable
  if (password !== process.env.FLEET_MANAGER_SECRET) {
    return res.status(401).json({ error: "Invalid password" });
  }

  try {
    // verify the driver exists
    const driverResult = await db.query(
      `SELECT id, name FROM driver WHERE phone_number = $1`,
      [phone_number]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // this will cascade to trips and risk_events
    const deleteResult = await db.query(
      `DELETE FROM driver WHERE phone_number = $1 RETURNING *`,
      [phone_number]
    );

    res.json({
      message: "Driver and all associated data deleted successfully",
      deletedDriver: deleteResult.rows[0],
    });
  } catch (err) {
    console.error("Error deleting driver:", err);
    res.status(500).json({
      error: "Failed to delete driver and associated data",
      details: err.message,
    });
  }
});

module.exports = router;
