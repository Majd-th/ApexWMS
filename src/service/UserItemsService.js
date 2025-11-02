// Import repository and DTO for user items
import { UserItemsRepository } from "../domain/Repositories/UserItemsRepository.js";
import { UserItemsDTO } from "../domain/DTO/UserItemsDTO.js";
//console.log("🧩 service loading..."); // Debugging message to confirm service loaded

// Service that manages which items belong to which user
export class UserItemsService {
    constructor(userItemsRepository) {
        // Inject user items repository
        this.userItemsRepository = userItemsRepository;
    }

    // 🟢 Add item to user’s inventory
    async addItemToUser(user_id, item_id, acquired_at) {
        try {
            // Validate numeric IDs
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            if (!item_id || isNaN(item_id)) throw new Error("Invalid item ID");

            // Use provided date or current timestamp
            const timestamp = acquired_at || new Date();

            // Save new user-item record
            const userItem = await this.userItemsRepository.save(user_id, item_id, timestamp);

            // Return as DTO
            return UserItemsDTO.fromEntity(userItem);
        } catch (error) {
            throw new Error(`Failed to add item to user: ${error.message}`);
        }
    }

    // 🔍 Get all items owned by a user
    async getUserItemsByUserId(user_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            const userItems = await this.userItemsRepository.findByUserId(user_id);
            return userItems.map(userItem => UserItemsDTO.fromEntity(userItem));
        } catch (error) {
            throw new Error(`Failed to get user items: ${error.message}`);
        }
    }

    // 🔍 Check if a user owns a specific item
    async checkUserOwnsItem(user_id, item_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            if (!item_id || isNaN(item_id)) throw new Error("Invalid item ID");
            const ownsItem = await this.userItemsRepository.checkUserOwnsItem(user_id, item_id);
            return ownsItem;
        } catch (error) {
            throw new Error(`Failed to check user item ownership: ${error.message}`);
        }
    }

    // 🔍 Get all user items
    async getUserItems(user_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            const userItems = await this.userItemsRepository.findByUser(user_id);
            return userItems.map(userItem => UserItemsDTO.fromEntity(userItem));
        } catch (error) {
            throw new Error(`Failed to get user items: ${error.message}`);
        }
    }
}
