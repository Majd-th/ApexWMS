import { pool } from "../../../config/db.js";   // Import database connection pool
import { Items } from "../entities/Items.js";   // Import entity structure for item objects

// Repository managing CRUD operations for the "items" table
export class ItemsRepository {

  // 🟢 CREATE a new item in the database
  async save(item_name, category, subcategory, legend_id, damage, ammo_type, description) {
    const sql = `
      INSERT INTO items (item_name, category, subcategory, legend_id, damage, ammo_type, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [item_name, category, subcategory, legend_id, damage, ammo_type, description];
    const { rows } = await pool.query(sql, values);
    return new Items(rows[0]);   // Return the created item as an entity
  }

  // 🟡 UPDATE an existing item
  async update(item_id, { item_name, category, subcategory, legend_id, damage, ammo_type, description }) {
    const sql = `
      UPDATE items
      SET item_name = $1, category = $2, subcategory = $3, legend_id = $4,
          damage = $5, ammo_type = $6, description = $7
      WHERE item_id = $8
      RETURNING *;
    `;
    const values = [item_name, category, subcategory, legend_id, damage, ammo_type, description, item_id];
    const { rows } = await pool.query(sql, values);
    return rows[0] ? new Items(rows[0]) : null;  // Return updated item or null if not found
  }

  // 🔴 DELETE an item by ID
  async deleteById(item_id) {
    await pool.query(`DELETE FROM items WHERE item_id = $1;`, [item_id]);
    return true;
  }

  // 🔍 READ all items from the database
  async findAll() {
    const sql = `
      SELECT item_id, item_name, category, subcategory, legend_id, damage, ammo_type, description
      FROM items
      ORDER BY item_id ASC;
    `;
    const { rows } = await pool.query(sql);
    return rows.map(row => new Items(row));  // Return all items as entities
  }

  // 🔍 READ a specific item by its ID
  async findById(item_id) {
    const sql = `
      SELECT item_id, item_name, category, subcategory, legend_id, damage, ammo_type, description
      FROM items
      WHERE item_id = $1;
    `;
    const { rows } = await pool.query(sql, [item_id]);
    return rows[0] ? new Items(rows[0]) : null;
  }
}

/*
🪲 Debugging note:
During development, console logs were often added temporarily after pool.query()
to verify the returned SQL data. Example: console.log("Item inserted:", rows[0]);
This helped confirm correct DB schema matching and detect field name mismatches.
*/
