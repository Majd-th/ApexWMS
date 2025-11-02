import e from "express";                                    // Express import (optional, not used here)
import {pool} from  "../../../config/db.js";                // Import the database connection pool
import { UserPack } from "../entities/UserPacks.js";        // Import UserPack entity (represents a record in user_packs)

export class UserPacksRepository {

  // 🟢 Save a record when a user obtains a pack ]
  async save(user_id, pack_id, obtained_at) {
  const sql = `
    INSERT INTO user_packs (user_id, pack_id, obtained_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user_id, pack_id, obtained_at];
  const { rows } = await pool.query(sql, values);
  return new UserPack(rows[0]);
}


  // 🔍 Find all packs owned by a specific user
  async findByUserId(user_id) {
    const sql = `
      SELECT * 
      FROM user_packs
      WHERE user_id = $1
      ORDER BY user_pack_id DESC;                              // Orders by most recent first
    `;
    const { rows } = await pool.query(sql, [user_id]);         // Runs query
    return rows.map(row => new UserPack(row));                 // Maps result rows to entities
  }

  // 🔍 Check if a user already owns a specific pack
  async checkUserOwnsPack(user_id, pack_id){
    const sql = `
      SELECT * 
      FROM user_packs
      WHERE user_id = $1 AND pack_id = $2
      ORDER BY user_pack_id DESC;
    `;
    const { rows } = await pool.query(sql, [user_id, pack_id]); // Executes query with user_id and pack_id
    return rows.length > 0;                                    // Returns true if at least one row found
  }

  // 🔍 Retrieve all user_packs records for one user
  async findByUser(user_id){
    const sql = `
      SELECT * 
      FROM user_packs
      WHERE user_id = $1
      ORDER BY user_pack_id DESC;
    `;
    const { rows } = await pool.query(sql, [user_id]);         // Executes query
    return rows.map(row => new UserPack(row));                 // Converts results to entities
  }
  // 🟢 Marks a pack as opened for a specific user
async markAsOpened(user_id, pack_id) {
  const sql = `
    UPDATE user_packs
    SET opened = TRUE, opened_at = NOW()
    WHERE user_id = $1 AND pack_id = $2
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(sql, [user_id, pack_id]);
    if (rows.length === 0) {
      throw new Error(`No pack found for user_id=${user_id} and pack_id=${pack_id}`);
    }
    console.log(`✅ Pack ${pack_id} marked as opened for user ${user_id}`);
    return rows[0];
  } catch (error) {
    console.error("❌ Error marking pack as opened:", error.message);
    throw new Error("Database error while marking pack as opened");
  }
}


}

/*
🪲 Debugging Notes:
- Temporary console logs were used to verify when user obtained a pack:
  Example:
     console.log("🎁 Pack saved:", rows[0]);
- Helped confirm the linkage between users and packs worked correctly.
*/
