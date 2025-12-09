// Import DTO for pack rewards
import { PackRewardDTO } from "../domain/DTO/PackRewardDTO.js";

// Handles business logic for pack reward management
export class PackRewardService {
  constructor(PackRewardRepository) {
    // Inject repository
    this.PackRewardRepository = PackRewardRepository;
  }

  // 🔍 Get all rewards belonging to a specific pack
  async getRewardsByPack(pack_id) {
    // Fetch rewards for the given pack_id
    const rewards = await this.PackRewardRepository.findByPack(pack_id);
    // Convert each reward entity into DTO
    return rewards.map(PackRewardDTO.fromEntity);
  }

  // 🟢 Create a new reward entry
  async createReward(data) {
    // Destructure fields
    const { pack_id, item_id, legend_id, drop_rate } = data;

    // Validate mandatory fields
    if (!pack_id || !drop_rate) {
      throw new Error("Missing required fields");
    }

    // Save reward in repository
    const reward = await this.PackRewardRepository.save(pack_id, item_id, legend_id, drop_rate);
    // Return as DTO
    return PackRewardDTO.fromEntity(reward);
  }

  // 🔴 Delete reward by ID
  async deleteReward(id) {
    // Call repository delete method
    return await this.PackRewardRepository.deleteById(id);
  }
}
