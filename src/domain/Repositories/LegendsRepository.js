import { pool } from "../../../config/db.js";
import { Legends } from "../entities/Legends.js";

// Repository handling all interactions with the "legends" table
export class LegendsRepository {

  // 🔍 FIND legends by ability name (join with abilities table)
  async findByAbility(ability) {
    const sql = `
      SELECT l.*, a.*
      FROM legends l
      JOIN abilities a ON l.legend_id = a.legend_id
      WHERE a.ability_name ILIKE $1;
    `;
    const { rows } = await pool.query(sql, [`%${ability}%`]);
    return rows.map(row => new Legends(row));
  }

  // 🔍 FIND legends by name (case-insensitive search)
  async findByName(name) {
    const sql = `SELECT * FROM legends WHERE name ILIKE $1`;
    const { rows } = await pool.query(sql, [`%${name}%`]);
    return rows.map(row => new Legends(row));
  }

  // 🟡 UPDATE legend details
  async update(legend_id, { name, role, description }) {
    const sql = `
      UPDATE legends
      SET name = $1, role = $2, description = $3
      WHERE legend_id = $4
      RETURNING *;
    `;
    const values = [name, role, description, legend_id];
    const { rows } = await pool.query(sql, values);
    return rows.length === 0 ? null : new Legends(rows[0]);
  }

  // 🟢 CREATE a new legend record
  async save(name, role, description) {
    const sql = `
      INSERT INTO legends (name, role, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, role, description || null];
    const { rows } = await pool.query(sql, values);
    if (rows.length === 0) throw new Error("Failed to insert legend");
    return rows[0];
  }

  // 🔴 DELETE a legend by ID
  async deleteById(legend_id) {
    await pool.query(`DELETE FROM legends WHERE legend_id = $1;`, [legend_id]);
    return true;
  }

  // 🔍 READ all legends (with their abilities)
  async findAll() {
    const sql = `
      SELECT 
        l.legend_id,
        l.name AS legend_name,
        l.role,
        l.description AS legend_description,        -- ✅ added here
        a.ability_id,
        a.ability_name,
        a.ability_type,
        a.description AS ability_description
      FROM legends l
      LEFT JOIN abilities a ON l.legend_id = a.legend_id
      ORDER BY l.legend_id, a.ability_type;
    `;
    const { rows } = await pool.query(sql);

    // Group abilities by legend
    const legendsMap = new Map();
    for (const row of rows) {
      if (!legendsMap.has(row.legend_id)) {
        legendsMap.set(row.legend_id, {
          legend_id: row.legend_id,
          name: row.legend_name,
          role: row.role,
          description: row.legend_description,     // ✅ added here
          abilities: [],
        });
      }
      if (row.ability_id) {
        legendsMap.get(row.legend_id).abilities.push({
          ability_id: row.ability_id,
          ability_name: row.ability_name,
          ability_type: row.ability_type,
          description: row.ability_description,
        });
      }
    }

    return Array.from(legendsMap.values()).map(l => new Legends(l));
  }

  // 🔍 READ a single legend (with all abilities)
  async findById(legend_id) {
    const sql = `
      SELECT 
        l.legend_id,
        l.name AS legend_name,
        l.role,
        l.description AS legend_description,       -- ✅ added here
        a.ability_id,
        a.ability_name,
        a.ability_type,
        a.description AS ability_description
      FROM legends l
      LEFT JOIN abilities a ON l.legend_id = a.legend_id
      WHERE l.legend_id = $1
      ORDER BY a.ability_type;
    `;
    const { rows } = await pool.query(sql, [legend_id]);
    if (rows.length === 0) return null;

    // Combine data into one object with nested abilities
    const legend = {
      legend_id: rows[0].legend_id,
      name: rows[0].legend_name,
      role: rows[0].role,
      description: rows[0].legend_description,    // ✅ added here
      abilities: []
    };

    for (const row of rows) {
      if (row.ability_id) {
        legend.abilities.push({
          ability_id: row.ability_id,
          ability_name: row.ability_name,
          ability_type: row.ability_type,
          description: row.ability_description
        });
      }
    }
    return legend;
  }

  // 🔍 FIND legends by role (e.g., "Offense", "Support")
  async findByRole(role) {
    const sql = `SELECT * FROM legends WHERE role = $1`;
    const { rows } = await pool.query(sql, [role]);
    return rows.map(row => new Legends(row));
  }
}
