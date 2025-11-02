// Import the Data Transfer Object (DTO) for abilities — used to transform DB entities into response objects
import { AbilitiesDTO } from "../domain/DTO/AbilitiesDTO.js";

// The service layer handles business logic between controllers and repositories
export class AbilitiesService {
    // Constructor takes the repository as a dependency (dependency injection)
    constructor(AbilitiesRepository) {
        // Save the repository instance to use in the service methods
        this.AbilitiesRepository = AbilitiesRepository;
    }

    // 🔍 Fetch all abilities for a specific legend
    async getAbilitiesByLegend(legend_id) {
        // Calls repository method to get all abilities belonging to a given legend
        const abilities = await this.AbilitiesRepository.findByLegendId(legend_id);
        // Converts each ability entity into a DTO (data transfer object) for consistent API output
        return abilities.map(AbilitiesDTO.fromEntity);
    }

    // 🟢 Create a new ability
    async createAbility(data) {
        // Extract needed fields from the data object
        const { legend_id, ability_name, ability_type, description } = data;

        // Validate required fields before creating
        if (!legend_id || !ability_name || !ability_type) {
            throw new Error("Missing required fields");
        }

        // Call repository to save the new ability in the database
        const ability = await this.AbilitiesRepository.save(legend_id, ability_name, ability_type, description);

        // Return the created ability as a DTO
        return AbilitiesDTO.fromEntity(ability);
    }

    // 🟡 Update an existing ability by ID
    async updateAbility(id, data) {
        // Call repository to update ability using ID and data
        const updated = await this.AbilitiesRepository.update(id, data);

        // If updated successfully, convert to DTO, otherwise return null
        return updated ? AbilitiesDTO.fromEntity(updated) : null;
    }

    // 🔴 Delete ability by ID
    async deleteAbility(id) {
        // Calls repository to delete ability record
        return await this.AbilitiesRepository.delete(id);
    }

    // 🔍 Get a single ability by legend and ability IDs
    async getByLegendAndAbility(legend_id, ability_id) {
        // Fetch ability that matches both legend and ability ID
        const ability = await this.AbilitiesRepository.findByLegendAndAbility(legend_id, ability_id);

        // If not found, throw a descriptive error
        if (!ability) throw new Error(`Ability ${ability_id} not found for Legend ${legend_id}`);

        // Return ability data directly (already includes legend info)
        return ability;
    }
}
