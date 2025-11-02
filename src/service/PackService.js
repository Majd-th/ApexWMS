// Import Data Transfer Object for packs
import { PackDTO } from "../domain/DTO/PackDTO.js";

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

  // 💰 BUY PACK
  async buyPack(user_id, pack_id) {
    const pack = await this.PackRepository.findById(pack_id);
    if (!pack) throw new Error("Pack not found");

    const user = await this.UserRepository.findById(user_id);
    if (!user) throw new Error("User not found");
    if (user.coins < pack.price) throw new Error("Insufficient balance");

    await this.UserRepository.updateCoins(user_id, user.coins - pack.price);
    await this.UserPacksRepository.save(user_id, pack_id, new Date());

    await this.TransactionsRepository.save({
      user_id,
      action: "BUY_PACK",
      pack_id,
      amount: pack.price,
    });

    return { message: "Pack purchased successfully" };
  }// 🎁 OPEN PACK
async openPack(user_id, pack_id) {
  // 🧾 Step 1: Verify ownership
  const ownsPack = await this.UserPacksRepository.checkUserOwnsPack(user_id, pack_id);
  if (!ownsPack) throw new Error("User does not own this pack");

  // 🎁 Step 2: Retrieve all rewards tied to this pack
  const rewards = await this.PackRewardsRepository.findByPack(pack_id);
  if (!rewards || rewards.length === 0) throw new Error("Pack has no rewards");

  // 📦 Step 3: Get user's owned items (safe fallback)
  const ownedItems = (await this.UserItemsRepository.findByUserId(user_id)) || [];
  const ownedItemIds = ownedItems
    .filter(i => i && i.item_id !== undefined && i.item_id !== null)
    .map(i => i.item_id);

  // 🚫 Step 4: Filter out already owned items (supports legends & items)
  const availableRewards = rewards.filter(r => {
    const isItem = r.item_id !== null && r.item_id !== undefined;
    const isLegend = r.legend_id !== null && r.legend_id !== undefined;

    // Exclude already-owned items
    if (isItem && ownedItemIds.includes(r.item_id)) return false;

    // Keep if it's an item or a legend
    return isItem || isLegend;
  });

  // 🧩 Debugging logs (for console)
  console.log("🎁 All rewards:", rewards);
  console.log("🎒 Owned Items:", ownedItemIds);
  console.log("✅ Available Rewards after filtering:", availableRewards);

  if (availableRewards.length === 0)
    throw new Error("User already owns all items in this pack!");

  // 🎯 Step 5: Weighted random selection based on drop_rate
  // 🎯 Step 5: Weighted random selection based on drop_rate
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


  // ⚠️ Safety: if no reward chosen
  if (!reward) throw new Error("❌ No reward selected – check drop rates or data.");

  // 💾 Step 6: Save the reward (item or legend)
  if (reward.item_id) {
    await this.UserItemsRepository.saveIfNotOwned(user_id, reward.item_id);
  } else if (reward.legend_id && this.UserLegendsRepository) {
    await this.UserLegendsRepository.saveIfNotOwned(user_id, reward.legend_id);
  }

  // ✅ Step 7: Mark pack as opened
  await this.UserPacksRepository.markAsOpened(user_id, pack_id);

  // 🪙 Step 8: Log transaction safely
  if (this.TransactionsRepository && this.TransactionsRepository.save) {
    await this.TransactionsRepository.save({
      user_id,
      action: "OPEN_PACK",
      pack_id,
      reward_id: reward.reward_id || null,
    });
  }

  // 🎉 Step 9: Return clean response
  return {
    message: "🎁 Pack opened successfully!",
    reward: reward,
  };
}

 }
