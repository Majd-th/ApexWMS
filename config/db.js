// Import the Pool class from the 'pg' (PostgreSQL) library
// Pool allows multiple database queries to be handled efficiently
import { Pool } from 'pg';

// Import dotenv to load environment variables from the .env file
// This keeps sensitive data like passwords and usernames hidden
import dotenv from "dotenv";
dotenv.config(); // Activates dotenv so process.env variables can be used below

// Create a new PostgreSQL connection pool
// The pool will manage multiple connections automatically
export const pool = new Pool({
  host: process.env.PGHOST,         // Hostname or IP address of the PostgreSQL server
  port: process.env.PGPORT,         // Port number (default: 5432)
  database: process.env.PGDATABASE, // Database name (example: apexdb)
  user: process.env.PGUSER,         // Database username
  password: process.env.PGPASSWORD  // Database password (loaded from .env)
});

// A simple test function to verify the database connection
// It runs a small query (SELECT 1) and returns the result if successful
export const healthCheck = async () => {
  const { rows } = await pool.query('SELECT 1 as ok'); // Executes a light test query
  return rows[0].ok; // Returns 1 if connected properly
};

// This conditional checks if PGPASSWORD is missing in the .env file
// Helps the developer catch configuration errors early
if (!process.env.PGPASSWORD) {
  console.error("❌ PGPASSWORD is missing in .env"); // Logs an error to the console for debugging
}

/*
Debugging usage:
While developing, console logs were used to check whether the .env variables were being loaded correctly
and to verify that the database connection was successful. For example, if the app failed to start,
a missing variable message here quickly pointed to the issue in the .env setup.
*/
