// Represents a loot pack that users can buy or earn
export class PackEntity {
  constructor({ pack_id, pack_name, price, description }) {
    this.pack_id = pack_id;           // (int) Unique ID for the pack
    this.pack_name = pack_name;       // (string) Pack name (e.g., "Apex Pack", "Event Pack")
    this.price = price;               // (int) Cost of the pack in in-game currency
    this.description = description;   // (string) Explanation or promotional text for the pack
  }
}

/*
Each pack contains items or legends as rewards.
Admins create packs and assign rewards through pack_rewards.
*/
