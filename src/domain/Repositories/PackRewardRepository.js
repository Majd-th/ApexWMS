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

  
 // 🔍 Retrieves all rewards for a given pack ID with item/legend info
async findByPack(pack_id) {
  const sql = `
    SELECT 
      pr.reward_id,
      pr.pack_id,
      pr.item_id,
      pr.legend_id,
      pr.drop_rate,

      -- ITEM INFO
      i.item_name,
      i.description,
      i.category,
      
      -- AUTO IMAGE FOR ITEMS (IMPORTANT)
      LOWER(REPLACE(i.item_name, ' ', '_')) || '.png' AS item_image

      -- If you add legend images:
      -- l.legend_name,
      -- LOWER(REPLACE(l.legend_name, ' ', '_')) || '.png' AS legend_image

    FROM pack_rewards pr
    LEFT JOIN items i ON pr.item_id = i.item_id
    -- LEFT JOIN legends l ON pr.legend_id = l.legend_id  (future feature)

    WHERE pr.pack_id = $1
    ORDER BY pr.reward_id DESC;
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
