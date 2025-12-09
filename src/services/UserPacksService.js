// Import DTO and Repository for user packs
import { UserPacksDTO } from "../domain/DTO/UserPacksDTO.js";
import { UserPacksRepository } from "../domain/Repositories/UserPacksRepository.js";

// Service for managing packs owned by users
export class UserPacksService {
    constructor(UserPacksRepository) {
        this.UserPacksRepository = UserPacksRepository;
    }

    // 🟢 Add a pack to a user’s collection
    async addUserPack(data) {
        try {
            // Validate required fields
            if (!data || !data.user_id || !data.pack_id || !data.obtained_at)
                throw new Error("Missing required fields: user_id, pack_id, obtained_at");

            // Save to repository
            const userPack = await this.UserPacksRepository.save(
                data.user_id,
                data.pack_id,
                data.obtained_at
            );

            // Return DTO
            return UserPacksDTO.fromEntity(userPack);
        } catch (error) {
            throw new Error(`Failed to add user pack: ${error.message}`);
        }
    }

    // 🔍 Get all packs owned by a user
    async getUserPacksByUserId(user_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            const userPacks = await this.UserPacksRepository.findByUser(user_id);
            return userPacks.map(userPack => UserPacksDTO.fromEntity(userPack));
        } catch (error) {
            throw new Error(`Failed to get user packs: ${error.message}`);
        }
    }

    // 🔍 Check if user owns a specific pack
    async checkUserOwnsPack(user_id, pack_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            if (!pack_id || isNaN(pack_id)) throw new Error("Invalid pack ID");
            const ownsPack = await this.UserPacksRepository.checkUserOwnsPack(user_id, pack_id);
            return ownsPack;
        } catch (error) {
            throw new Error(`Failed to check user pack ownership: ${error.message}`);
        }
    }

    // 🔍 Get all user packs with details
    async getUserPacks(user_id) {
        try {
            if (!user_id || isNaN(user_id)) throw new Error("Invalid user ID");
            const userPacks = await this.UserPacksRepository.findByUser(user_id);
            return userPacks.map(userPack => UserPacksDTO.fromEntity(userPack));
        } catch (error) {
            throw new Error(`Failed to get user packs: ${error.message}`);
        }
    }
}
