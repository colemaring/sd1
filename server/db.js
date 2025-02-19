const { Pool } = require("pg");
require("dotenv").config();

// from .env
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;

console.log(user, password);

const pool = new Pool({
  user: "postgres",
  host: host,
  database: database,
  password: "3YyAke3$$fR@EnwF",
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
