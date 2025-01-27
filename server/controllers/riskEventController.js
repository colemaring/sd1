const db = require('../db'); // Import database configuration

// Create a risk event (haven't tested yet)
exports.createRiskEvent = async (req, res) => {
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
};

// Get all risk events (tested and working)
exports.getAllRiskEvents = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM risk_event`);
    res.json(result.rows); // Send back the list of risk events
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors gracefully
  }
};
