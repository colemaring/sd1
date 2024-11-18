const { Pool } = require('pg');

const pool = new Pool({
  user: 'aiforsafedriving',
  host: 'greensaver.llasreip.com',
  database: 'aisafety',
  password: 'DbLogin2024!',
  port: 15432,
});

pool.connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });

module.exports = pool;