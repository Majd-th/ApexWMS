// Import the database connection pool from config
import { pool } from "../../../config/db.js";

// The AbilitiesRepository handles all CRUD operations for the "abilities" table
export class AbilitiesRepository {

  // 🔍 FIND ability by a specific legend and ability IDs
  async findByLegendAndAbility(legend_id, ability_id) {
    // SQL query: joins abilities and legends tables to get detailed info
    const sql = `
      SELECT 
        a.ability_id,                   -- int: primary key for ability
        a.ability_name,                 -- string: name of the ability
        a.ability_type,                 -- string: type (e.g., Tactical, Passive, Ultimate)
        a.description AS ability_description, -- string: description of ability
        l.legend_id,                    -- int: foreign key (links ability to legend)
        l.name AS legend_name,          -- string: legend's name
        l.role AS legend_role           -- string: legend's role/class
      FROM abilities a
      INNER JOIN legends l ON a.legend_id = l.legend_id
      WHERE a.legend_id = $1 AND a.ability_id = $2; -- filters by legend + ability IDs
    `;
    // Execute query with parameterized values to prevent SQL injection
    const { rows } = await pool.query(sql, [legend_id, ability_id]);
    if (rows.length === 0) return null; // No ability found for given IDs

    // Extract the first row (since only one result expected)
    const row = rows[0];
    // Return a formatted JavaScript object
    return {
      ability_id: row.ability_id,
      ability_name: row.ability_name,
      ability_type: row.ability_type,
      description: row.ability_description,
      legend: {
        legend_id: row.legend_id,
        name: row.legend_name,
        role: row.legend_role
      }
    };
  }

  // 🔍 FIND ALL abilities (with their related legend info)
  async findAll() {
    const sql = `
      SELECT 
        a.ability_id,
        a.ability_name,
        a.ability_type,
        a.description AS ability_description,
        l.legend_id,
        l.name AS legend_name,
        l.role AS legend_role
      FROM abilities a
      LEFT JOIN legends l ON a.legend_id = l.legend_id
      ORDER BY a.ability_id;
    `;
    const { rows } = await pool.query(sql);

    // Map each row to a clean object
    return rows.map(row => ({
      ability_id: row.ability_id,
      ability_name: row.ability_name,
      ability_type: row.ability_type,
      description: row.ability_description,
      legend: {
        legend_id: row.legend_id,
        name: row.legend_name,
        role: row.legend_role
      }
    }));
  }

  // 🔍 FIND all abilities that belong to a specific legend (by legend_id)
  async findByLegendId(legend_id) {
    const sql = `
      SELECT 
        a.ability_id,
        a.ability_name,
        a.ability_type,
        a.description AS ability_description,
        l.legend_id,
        l.name AS legend_name,
        l.role AS legend_role
      FROM abilities a
      INNER JOIN legends l ON a.legend_id = l.legend_id
      WHERE a.legend_id = $1
      ORDER BY a.ability_id;
    `;
    const { rows } = await pool.query(sql, [legend_id]);

    // Return all abilities for the given legend
    return rows.map(row => ({
      ability_id: row.ability_id,
      ability_name: row.ability_name,
      ability_type: row.ability_type,
      description: row.ability_description,
      legend: {
        legend_id: row.legend_id,
        name: row.legend_name,
        role: row.legend_role
      }
    }));
  }

  // 🟢 CREATE a new ability (INSERT)
  async save(legend_id, ability_name, ability_type, description) {
    const sql = `
      INSERT INTO abilities (legend_id, ability_name, ability_type, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *; -- returns the newly inserted row
    `;
    // Parameters:
    // legend_id (int): ID of the related legend
    // ability_name (string): name of the ability
    // ability_type (string): type (e.g. Passive, Tactical, Ultimate)
    // description (string): text explaining what the ability does
    const { rows } = await pool.query(sql, [legend_id, ability_name, ability_type, description]);
    return rows[0]; // Return inserted ability record
  }

  // 🟡 UPDATE an existing ability
  async update(ability_id, { ability_name, ability_type, description }) {
    const sql = `
      UPDATE abilities
      SET ability_name = $1,
          ability_type = $2,
          description = $3
      WHERE ability_id = $4
      RETURNING *; -- returns updated row
    `;
    // Parameters:
    // ability_id (int): ID of the ability to update
    // ability_name (string): new name
    // ability_type (string): new type
    // description (string): new description
    const { rows } = await pool.query(sql, [ability_name, ability_type, description, ability_id]);
    return rows[0]; // Return updated ability
  }

  // 🔴 DELETE ability by ID
  async delete(ability_id) {
    const sql = `
      DELETE FROM abilities
      WHERE ability_id = $1
      RETURNING *; -- optionally returns deleted record
    `;
    // ability_id (int): the ID of the ability to remove
    const { rows } = await pool.query(sql, [ability_id]);
    return rows[0]; // Return deleted ability (optional)
  }
  
}
