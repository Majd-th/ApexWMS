
// DTO for PackRewards — defines which reward data is returned
export class PackRewardDTO {
  constructor({ reward_id, pack_id, item_id, legend_id, drop_rate }) {
    this.reward_id = reward_id;   // (int) Reward ID
    this.pack_id = pack_id;       // (int) Pack associated with the reward
    this.item_id = item_id;       // (int or null) ID of rewarded item
    this.legend_id = legend_id;   // (int or null) ID of rewarded legend
    this.drop_rate = drop_rate;   // (decimal) Drop chance for this reward
  }

  static fromEntity(entity) {
    return new PackRewardDTO(entity);
  }
}
