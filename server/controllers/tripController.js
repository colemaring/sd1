const db = require('../db'); // Import your database configuration

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trip');
    res.json(result.rows); // Return the fetched trips as JSON
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle any errors
  }
};
