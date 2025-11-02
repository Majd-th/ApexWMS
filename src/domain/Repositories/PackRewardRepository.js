import { pool } from "../../../config/db.js";

export class PackRewardRepository {

  // 🟢 Create a new pack reward (links packs to their possible rewards)
  async save(pack_id, item_id, legend_id, drop_rate) {
    const sql = `
      INSERT INTO pack_rewards (pack_id, item_id, legend_id, drop_rate)
      VALUES ($1, $2, $3, $4)
      RETURNING reward_id, pack_id, item_id, legend_id, drop_rate;
    `; // Returns inserted reward
    const values = [pack_id, item_id, legend_id, drop_rate];
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

  // 🔴 Deletes a reward by its unique ID  
  async deleteById(reward_id) {
    await pool.query(`DELETE FROM pack_rewards WHERE reward_id = $1;`, [reward_id]);
    return true;
  }

  // 🔍 Retrieves all rewards for a given pack ID
  async findByPack(pack_id) {
    const sql = `
      SELECT reward_id, pack_id, item_id, legend_id, drop_rate
      FROM pack_rewards
      WHERE pack_id = $1
      ORDER BY reward_id DESC;
    `;
    const { rows } = await pool.query(sql, [pack_id]);
    return rows;
  }
}

/*
🪲 Debugging Notes:
- Logs were used to confirm successful reward creation and deletion:
   console.log("🎁 Reward saved:", rows[0]);
- Helped verify correct linking between packs, legends, and items.
*/
