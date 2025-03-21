const { Pool } = require("pg");
require("dotenv").config();

// from .env
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;


const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });

module.exports = pool;
