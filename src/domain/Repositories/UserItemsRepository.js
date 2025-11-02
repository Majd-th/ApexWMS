import { pool } from "../../../config/db.js"; // Database connection
import { UserItems } from "../entities/UserItems.js"; // Optional entity mapper

export class UserItemsRepository {
  // 🔍 Checks if a user already owns a specific item
  async checkUserOwnsItem(user_id, item_id) {
    const sql = `
      SELECT * 
      FROM user_items
      WHERE user_id = $1 AND item_id = $2
      ORDER BY user_item_id DESC;
    `;
    const { rows } = await pool.query(sql, [user_id, item_id]);
    return rows.length > 0; // ✅ Returns true if user already owns it
  }

  // 🔍 Retrieves all items owned by a specific user
  async findByUserId(user_id) {
    const sql = `
      SELECT 
        ui.user_item_id,
        ui.user_id,
        ui.item_id,
        i.item_name AS item_name,      
        i.category,
        i.subcategory
      FROM user_items AS ui
      JOIN items AS i ON ui.item_id = i.item_id
      WHERE ui.user_id = $1
      ORDER BY ui.user_item_id DESC;
    `;

    const { rows } = await pool.query(sql, [user_id]);
    console.log("✅ User items with names:", rows);
    return rows;
  }
  // 🟢 Inserts an item for the user *only if* not already owned
  async saveIfNotOwned(user_id, item_id) {
    // Check first if user already owns the item
    const checkSql = `
      SELECT * FROM user_items WHERE user_id = $1 AND item_id = $2;
    `;
    const { rows: existing } = await pool.query(checkSql, [user_id, item_id]);

    // If user already owns it, return that record
    if (existing.length > 0) return existing[0];

    // Otherwise, insert new record
    const insertSql = `
      INSERT INTO user_items (user_id, item_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(insertSql, [user_id, item_id]);
    return rows[0]; // ✅ Return inserted row
  }
}

/*
🪲 Debugging Notes:
- Always returns arrays or row objects, never null.
- Works safely with PackService.openPack().
- Compatible with entity-based mapping if UserItems class exists.
*/