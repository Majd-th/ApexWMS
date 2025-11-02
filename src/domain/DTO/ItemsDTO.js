// DTO for Items — controls which item data is visible externally
export class ItemsDTO {
  constructor({ item_id, item_name, category, subcategory, description }) {
    this.item_id = item_id;             // (int) Item ID
    this.item_name = item_name;         // (string) Name of the item
    this.category = category;           // (string) Main category (Weapon, Heirloom)
    this.subcategory = subcategory;     // (string) Type (Pistol, Sniper, etc.)
    this.description = description;     // (string) Description of the item
  }

  static fromEntity(entity) {
    return new ItemsDTO(entity);
  }
}

/*
🧠 Note:
Excluded fields like 'damage', 'ammo_type', and 'legend_id' — 
since they’re not always needed in user-facing views.
*/
