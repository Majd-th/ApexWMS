

import { pool } from "../../../config/db.js";

export class TransactionsRepository {
      // 🟢 Save a transaction record
  async save(data) {
    const { user_id, action, pack_id, reward_id, amount } = data;
    const sql = `
      INSERT INTO transactions (user_id, action, pack_id, reward_id, amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [user_id, action, pack_id, reward_id, amount];
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }


  // 🔍 Get all transactions for a user (optional)
  async findByUser(user_id) {
    const sql = `
      SELECT * FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(sql, [user_id]);
    return rows;
  }

  // 🔍 Get all transactions (admin view)
  async findAll() {
    const sql = `
      SELECT * FROM transactions
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(sql);
    return rows;
  }
}
