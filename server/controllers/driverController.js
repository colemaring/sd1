const db = require('../db'); // Import database configuration (replace with your DB setup)

// Create a driver
exports.createDriver = async (req, res) => {
  const { name, phone_number, risk_score, fleet_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO driver (name, phone_number, risk_score, fleet_id) 
              VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, phone_number, risk_score, fleet_id]
    );
    res.status(201).json(result.rows[0]); // Respond with the created driver
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors gracefully
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM driver`);
    res.json(result.rows); // Send back the list of drivers
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors gracefully
  }
};

// Update a driver's active status
exports.updateDriverActiveStatus = async (req, res) => {
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
    res.status(200).json(result.rows[0]); // Respond with updated driver
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors gracefully
  }
};
