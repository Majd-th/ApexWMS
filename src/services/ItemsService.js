// Import repository and DTO for items
import { ItemsRepository } from "../domain/Repositories/ItemsRepository.js";
import { ItemsDTO } from "../domain/DTO/ItemsDTO.js";

// Handles business logic for items
export class ItemsService {
  constructor(ItemsRepository) {
    // Inject repository
    this.ItemsRepository = ItemsRepository;
  }

  // 🔍 Get all items
  async listItems() {
    // Retrieve all item records
    const items = await this.ItemsRepository.findAll();
    // Convert to DTOs
    return items.map(item => ItemsDTO.fromEntity(item));
  }

  // 🔍 Get one item by ID
  async getItemById(item_id) {
    // Fetch from repository
    const item = await this.ItemsRepository.findById(item_id);
    // Throw error if not found
    if (!item) throw new Error("Item not found");
    // Return DTO
    return ItemsDTO.fromEntity(item);
  }
   // 🟢 Create new item
async createItem(data) {

    // Clean and normalize input
    const clean = {
        item_name: data.item_name,
        category: data.category,
        subcategory: data.subcategory || null,
        legend_id: data.legend_id ? Number(data.legend_id) : null,
        damage: data.damage ? Number(data.damage) : null,
        ammo_type: data.ammo_type || null,
        description: data.description || null
    };

    // Save to DB
    const item = await this.ItemsRepository.save(
        clean.item_name,
        clean.category,
        clean.subcategory,
        clean.legend_id,
        clean.damage,
        clean.ammo_type,
        clean.description
    );

    return ItemsDTO.fromEntity(item);
}

 

  // 🟡 Update existing item
  async updateItem(item_id, data) {
    // Call repository update
    const updated = await this.ItemsRepository.update(item_id, data);
    // Return DTO or null
    return updated ? ItemsDTO.fromEntity(updated) : null;
  }

  // 🔴 Delete item
  async deleteItem(item_id) {
    // Delete by ID
    await this.ItemsRepository.deleteById(item_id);
    // Always return true
    return true;
  }
}
