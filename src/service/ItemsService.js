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
    // Destructure fields
    const { item_name, category, subcategory, legend_id, damage, ammo_type, description } = data;
    // Save in repository
    const item = await this.ItemsRepository.save(item_name, category, subcategory, legend_id, damage, ammo_type, description);
    // Return DTO
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
