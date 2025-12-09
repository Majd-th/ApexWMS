import { pool } from "../../../config/db.js";
import { User } from "../entities/users.js";

export class UserRepository {

  async save(username, email, passwordHash, coins) {
    const sql = `
      INSERT INTO users (username, email, password_hash, coins)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [username, email, passwordHash, coins];
    const { rows } = await pool.query(sql, values);
    return new User(rows[0]);
  }

  async update(user_id, data) {
    const sql = `
      UPDATE users
      SET username = $1, email = $2, coins = $3
      WHERE user_id = $4
      RETURNING *;
    `;
    const values = [data.username, data.email, data.coins, user_id];
    const { rows } = await pool.query(sql, values);
    return new User(rows[0]);
  }

  async updatePassword(user_id, passwordHash) {
    const sql = `
      UPDATE users
      SET password_hash = $1
      WHERE user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [passwordHash, user_id]);
    return new User(rows[0]);
  }

  async deleteById(user_id) {
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [user_id]);
    return true;
  }

  async findAll() {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY user_id");
    return rows.map(row => new User(row));
  }

  async findById(user_id) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    return rows[0] ? new User(rows[0]) : null;
  }

  async findByUsername(username) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 LIMIT 1",
      [username]
    );
    return rows[0] ? new User(rows[0]) : null;
  }
}
