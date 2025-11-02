// Represents one reward item/legend linked to a specific pack
export class PackReward {
  constructor({ reward_id, pack_id, item_id, legend_id, drop_rate }) {
    this.reward_id = reward_id;       // (int) Unique ID for each reward entry
    this.pack_id = pack_id;           // (int) The pack it belongs to
    this.item_id = item_id;           // (int or null) Item rewarded
    this.legend_id = legend_id;       // (int or null) Legend rewarded
    this.drop_rate = drop_rate;       // (decimal) Probability of getting this reward when opening the pack
  }
}

/*
Defines the possible outcomes when a user opens a pack.
Used to simulate loot drops.
*/
