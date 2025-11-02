// Represents an in-game item (like weapons, heirlooms, etc.)
export class Items {
  constructor({ item_id, item_name, category, subcategory, legend_id, damage, ammo_type, description }) {
    this.item_id = item_id;             // (int) Unique ID for the item
    this.item_name = item_name;         // (string) The item’s name (e.g., "Wingman")
    this.category = category;           // (string) Main category (Weapon, Heirloom, etc.)
    this.subcategory = subcategory;     // (string) Sub-type of item (Pistol, SMG, etc.)
    this.legend_id = legend_id;         // (int or null) Linked legend if the item belongs to one (like heirlooms)
    this.damage = damage;               // (int) Damage points if it’s a weapon
    this.ammo_type = ammo_type;         // (string) Ammo type used (Light, Heavy, Energy, etc.)
    this.description = description;     // (string) Description or lore of the item
  }
}

/*
Items are linked to packs and may belong to certain legends.
*/
