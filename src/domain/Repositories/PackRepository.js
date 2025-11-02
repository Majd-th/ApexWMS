import { pool } from "../../../config/db.js";
import { PackEntity } from "../entities/PackEntity.js";

// Repository for managing CRUD on "packs" table
export class PackRepository {

  // 🟢 CREATE pack
  async save(pack_name, price, description) {
    const sql = `
      INSERT INTO packs (pack_name, price, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [pack_name, price, description];
    const { rows } = await pool.query(sql, values);
    return new PackEntity(rows[0]);
  }

  // 🟡 UPDATE pack details
  async update(pack_id, { pack_name, price, description }) {
    const sql = `
      UPDATE packs
      SET pack_name = $1, price = $2, description = $3
      WHERE pack_id = $4
      RETURNING *;
    `;
    const values = [pack_name, price, description, pack_id];
    const { rows } = await pool.query(sql, values);
    return rows[0] ? new PackEntity(rows[0]) : null;
  }

  // 🔴 DELETE pack by ID
  async deleteById(pack_id) {
    await pool.query(`DELETE FROM packs WHERE pack_id = $1;`, [pack_id]);
    return true;
  }

  // 🔍 READ all packs
  async findAll() {
    const { rows } = await pool.query(`SELECT * FROM packs ORDER BY pack_id;`);
    return rows.map(r => new PackEntity(r));
  }

  // 🔍 READ one pack by ID
  async findById(pack_id) {
    const { rows } = await pool.query(
      `SELECT pack_id, pack_name, price, description FROM packs WHERE pack_id = $1;`,
      [pack_id]
    );
    return rows[0] || null;
  }
 

  async findByName(pack_name){
   const sql = ' Select * from packs where pack_name= $1';
   const { rows } = await pool.query(sql,[pack_name]);
   return rows[0] || null;
  }
}
