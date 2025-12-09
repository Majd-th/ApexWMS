// Import Express (although not used directly in this file)
import e from "express";

// Import the PostgreSQL connection pool from config
import { pool } from "../../../config/db.js";

// Import the Admins entity class that represents an admin record
import { Admins } from "../entities/Admins.js";

// The AdminsRepository class handles all CRUD operations
// for the "admins" table in the database.
export class AdminsRepository {

  // 🟢 CREATE — Insert a new admin record into the database
  async save(username, email, passwordHash) {
  const sql = `
    INSERT INTO admins (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [username, email, passwordHash];
  const { rows } = await pool.query(sql, values);
  return new Admins(rows[0]);
}
  // 🟡 UPDATE — Modify an existing admin's username or email
  async update(admin_id, { username, email }) {
    const sql = `
      UPDATE admins
      SET username = $1, email = $2
      WHERE admin_id = $3
      RETURNING *;  -- Returns updated record
    `;

    // Parameters:
    // admin_id (int): unique ID of the admin to update
    // username (string): new username
    // email (string): new email
    const values = [username, email, admin_id];

    const { rows } = await pool.query(sql, values);
    return new Admins(rows[0]); // Return updated admin as Admins entity
  }

  // 🔴 DELETE — Remove an admin by ID
  async deleteById(admin_id) {
    // Simple delete query using admin_id as filter
    await pool.query(`DELETE FROM admins WHERE admin_id = $1;`, [admin_id]);
    // No data returned — just confirm deletion
    return true;
  }

  // 🔍 READ — Get all admins from the table
  async findAll() {
    const sql = `SELECT * FROM admins ORDER BY admin_id;`;
    const { rows } = await pool.query(sql);

    // Map each database row into an Admins entity object
    return rows.map(row => new Admins(row));
  }

  // 🔍 READ — Find a single admin by ID
  async findById(admin_id) {
    const sql = `
      SELECT admin_id, username, email
      FROM admins
      WHERE admin_id = $1
      ORDER BY admin_id DESC;
    `;

    // Parameters:
    // admin_id (int): primary key for the admin
    const { rows } = await pool.query(sql, [admin_id]);

    // If found, wrap it in an Admins entity; else return null
    return rows[0] ? new Admins(rows[0]) : null;
  }// 🔍 READ — Find admin by username (
async findByUsername(username) {
  const sql = `
    SELECT *
    FROM admins
    WHERE username = $1
    LIMIT 1;
  `;
  const { rows } = await pool.query(sql, [username]);
  return rows[0] ? new Admins(rows[0]) : null;
}

}
