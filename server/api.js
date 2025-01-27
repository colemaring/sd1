const express = require("express");
const router = express.Router();
const db = require("./db");

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

// PATCH
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

// Read trips for a given driver
router.get("/trips/:driverPhone", async (req, res) => {
  const { driverPhone } = req.params;
  try {
    const driverResult = await db.query(
      `SELECT id FROM driver WHERE driverPhone = $1`,
      [driverPhone]
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

// Read all risk events
router.get("/risk-events", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM risk_events`);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read risk events for a given tripId
router.post("/risk-events", async (req, res) => {
  const { tripIds } = req.body;
  try {
    const result = await db.query(
      `SELECT * FROM risk_event WHERE trip_id = ANY($1::int[])`,
      [tripIds]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

module.exports = router;
