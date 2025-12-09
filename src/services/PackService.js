// Import Data Transfer Object for packs
import { PackDTO } from "../domain/DTO/PackDTO.js";
import { pool } from "../../config/db.js"; // Required for transactions

export class PackService {
  constructor(
    PackRepository,
    UserRepository,
    UserPacksRepository,
    UserItemsRepository,
    PackRewardsRepository,
    TransactionsRepository
    
  ) {
    // Inject repositories for each dependent table
    this.PackRepository = PackRepository;
    this.UserRepository = UserRepository;
    this.UserPacksRepository = UserPacksRepository;
    this.UserItemsRepository = UserItemsRepository;
    this.PackRewardsRepository = PackRewardsRepository;
    this.TransactionsRepository = TransactionsRepository;
  }

  // 🔍 Get all packs
  async listPacks() {
    const packs = await this.PackRepository.findAll();
    return packs.map(PackDTO.fromEntity);
  }

  // 🔍 Get one pack by ID
  async getPackById(id) {
    const pack = await this.PackRepository.findById(id);
    return pack ? PackDTO.fromEntity(pack) : null;
  }

  // 🟢 Create new pack
  async createPack(data) {
    const { pack_name, description, price } = data;
    if (!pack_name || !description || !price)
      throw new Error("Missing fields");
    const pack = await this.PackRepository.save(pack_name, price, description);
    return PackDTO.fromEntity(pack);
  }

  // 🟡 Update existing pack
  async updatePack(id, data) {
    const updated = await this.PackRepository.update(id, data);
    return updated ? PackDTO.fromEntity(updated) : null;
  }

  // 🔴 Delete pack
  async deletePack(id) {
    return await this.PackRepository.deleteById(id);
  }

  // 💰 BUY PACK — now using a FULL TRANSACTION
  async buyPack(user_id, pack_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN"); // 🔒 Start transaction

      // Step 1: Load pack
      const pack = await this.PackRepository.findById(pack_id);
      if (!pack) throw new Error("Pack not found");

      // Step 2: Load user
      const user = await this.UserRepository.findById(user_id);
      if (!user) throw new Error("User not found");
      if (user.coins < pack.price) throw new Error("Insufficient balance");

      // Step 3: Deduct coins
      await client.query(
        `UPDATE users SET coins = $1 WHERE user_id = $2`,
        [user.coins - pack.price, user_id]
      );

      // Step 4: Add pack to user
      await client.query(
        `INSERT INTO user_packs (user_id, pack_id, obtained_at)
         VALUES ($1, $2, NOW())`,
        [user_id, pack_id]
      );

      // Step 5: Add transaction log
      await client.query(
        `INSERT INTO transactions (user_id, action, pack_id, amount)
         VALUES ($1, $2, $3, $4)`,
        [user_id, "BUY_PACK", pack_id, pack.price]
      );

      // Commit the transaction
      await client.query("COMMIT");

      return { message: "Pack purchased successfully" };

    } catch (err) {
      await client.query("ROLLBACK"); // ⛔ Undo everything if error
      throw err;
    } finally {
      client.release(); // Always release the connection
    }
  }

  // 🎁 OPEN PACK — fully transactional version
  async openPack(user_id, pack_id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN"); // 🔒 Start transaction

      // 🧾 Step 1: Verify ownership
      const ownsPack = await this.UserPacksRepository.checkUserOwnsPack(user_id, pack_id);
      if (!ownsPack) throw new Error("User does not own this pack");

      // 🎁 Step 2: Retrieve all rewards tied to this pack
      const rewards = await this.PackRewardsRepository.findByPack(pack_id);
      if (!rewards || rewards.length === 0)
        throw new Error("Pack has no rewards");

      // 📦 Step 3: Get user's owned items (safe fallback)
      const ownedItems = await this.UserItemsRepository.findByUserId(user_id) || [];
      const ownedItemIds = ownedItems.map(i => i.item_id);

      // 🚫 Step 4: Filter out already owned items (supports legends & items)
      const availableRewards = rewards.filter(r => {
        const isItem = r.item_id !== null && r.item_id !== undefined;
        const isLegend = r.legend_id !== null && r.legend_id !== undefined;

        if (isItem && ownedItemIds.includes(r.item_id)) return false;
        return isItem || isLegend;
      });

      if (availableRewards.length === 0)
        throw new Error("User already owns all items in this pack!");

      // 🎯 Step 5: Weighted random selection
      const totalWeight = availableRewards.reduce(
        (sum, r) => sum + parseFloat(r.drop_rate || 0),
        0
      );

      const rand = Math.random() * totalWeight;
      let current = 0;
      let reward = null;

      for (const r of availableRewards) {
        current += parseFloat(r.drop_rate || 0);
        if (rand <= current) {
          reward = r;
          break;
        }
      }

      if (!reward)
        throw new Error("❌ No reward selected – check drop rates or data.");

      // 💾 Step 6: Save reward
      // 💾 Step 6: Save reward (item ONLY)
if (!reward.item_id) {
  throw new Error("Invalid reward: Pack reward must contain an item_id");
}

await client.query(
  `INSERT INTO user_items (user_id, item_id)
   SELECT $1, $2
   WHERE NOT EXISTS (
     SELECT 1 FROM user_items WHERE user_id = $1 AND item_id = $2
   )`,
  [user_id, reward.item_id]
);


     // ✅ Step 7: Remove ONE pack from inventory
     await client.query(
  `DELETE FROM user_packs
   WHERE user_pack_id = (
     SELECT user_pack_id
     FROM user_packs
     WHERE user_id = $1 AND pack_id = $2
     ORDER BY user_pack_id
     LIMIT 1
   )`,
  [user_id, pack_id]
);



      // 🪙 Step 8: Log transaction safely
      await client.query(
        `INSERT INTO transactions (user_id, action, pack_id, reward_id)
         VALUES ($1, $2, $3, $4)`,
        [user_id, "OPEN_PACK", pack_id, reward.reward_id]
      );

      // Commit transaction
      await client.query("COMMIT");

      // 🎉 Step 9: Return clean response
      
       return {
  message: "🎁 Pack opened successfully!",
  reward: {
    reward_id: reward.reward_id,
    item_id: reward.item_id,
    item_name: reward.item_name,
    item_image: reward.item_image
  
}

      };

    } catch (err) {
      await client.query("ROLLBACK"); // ⛔ Undo everything
      throw err;

    } finally {
      client.release(); // Free connection
    }
  }
}
