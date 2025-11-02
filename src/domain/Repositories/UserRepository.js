import e from "express";
import {pool} from  "../../../config/db.js";
//import { User } from "../entities/user.js";
import { User } from "../entities/users.js";
//import { pool } from "../../../config/db.js";
//import { User } from "../entities/User.js";

export class UserRepository {
  
 async updateCoins(user_id, newBalance) {
    const sql = `
      UPDATE users
      SET coins = $1
      WHERE user_id = $2
      RETURNING *;
    `;
    const values = [newBalance, user_id];
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

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

  async update(user_id, { username, email, coins }) {
    const sql = `
      UPDATE users
      SET username = $1, email = $2, coins = $3
      WHERE user_id = $4
      RETURNING *;
    `;
    const values = [username, email, coins, user_id];
    const { rows } = await pool.query(sql, values);
    return new User(rows[0]);
  }

  async deleteById(user_id) {
    await pool.query(`DELETE FROM users WHERE user_id = $1;`, [user_id]);
    return true;
  }

  async findAll() {
    const sql = `SELECT * FROM users ORDER BY user_id;`;
    const { rows } = await pool.query(sql);
    return rows.map(row => new User(row));
  }

  async findById(user_id) {
    const sql = `
      SELECT user_id, username, email, coins
      FROM users
      WHERE user_id = $1
      ORDER BY user_id DESC;
    `;
    const { rows } = await pool.query(sql, [user_id]);
    return rows[0] ? new User(rows[0]) : null;
  }

}
