// Import repository and DTO for legends
import { LegendsRepository } from "../domain/Repositories/LegendsRepository.js";
import { LegendsDTO } from "../domain/DTO/LegendsDTO.js";

// Service responsible for handling business logic related to Legends and their Abilities
export class LegendsService {
   constructor(LegendsRepository, AbilitiesRepository) {
    // Dependency injection for both repositories
    this.LegendsRepository = LegendsRepository;
    this.AbilitiesRepository = AbilitiesRepository;
  }

  // 🔍 Retrieve all legends (with abilities if any)
  async listLegends() {
    try {
        // Fetch all legends through repository
        const legends = await this.LegendsRepository.findAll();
        console.log("✅ Legends fetched:", legends);

        // Convert entities to DTOs
        return legends.map(legend => LegendsDTO.fromEntity(legend));
    } catch (error) {
        // Log and throw error
        console.error("❌ LegendsService.listLegends error:", error.stack || error);
        throw new Error(`Failed to list legends: ${error.message}`);
    }
  }

  // 🔍 Get a specific legend by ID
  async getLegendById(legend_id) {
    try {
        // Validate ID
        if (!legend_id || isNaN(legend_id)) throw new Error("Invalid legend ID");

        // Fetch legend from repository
        const legend = await this.LegendsRepository.findById(legend_id);

        // If not found, return null
        if (!legend) return null;

        // Convert to DTO and return
        return LegendsDTO.fromEntity(legend);
    } catch (error) {
        throw new Error(`Failed to get Legend : ${error.message}`);
    }
  }

  // 🟢 Create a new legend (and optionally abilities)
  async createLegend(data) {
    try {
      // Validate required fields
      if (!data || !data.name || !data.role) {
        throw new Error("Missing required fields: name, role");
      }

      console.log("🟢 Creating legend with data:", data);

      // Step 1: Create the legend in DB
      const legend = await this.LegendsRepository.save(
        data.name,
        data.role,
        data.description
      );

      if (!legend) {
        throw new Error("Legend creation failed — no data returned from repository");
      }

      console.log("✅ Legend created:", legend);

      // Step 2: Create related abilities if provided
      if (data.abilities && data.abilities.length > 0) {
        console.log("🟣 Creating abilities...");
        for (const ability of data.abilities) {
          try {
            // Save each ability linked to this legend
            await this.AbilitiesRepository.create({
              legend_id: legend.legend_id,
              ability_name: ability.ability_name,
              ability_type: ability.ability_type,
              description: ability.description,
            });
          } catch (abilityError) {
            console.error(`⚠️ Failed to create ability for ${legend.name}:`, abilityError.message);
          }
        }
      }

      console.log("✨ Legend and abilities created successfully");
      // Return the created legend as a DTO
      return LegendsDTO.fromEntity(legend);

    } catch (error) {
      // Handle duplicate name or other database constraint violations
      if (error.code === "23505") {
        console.error("❌ Duplicate legend name detected");
        throw new Error("Legend name already exists — please use a different name");
      }

      console.error("❌ Failed to create legend:", error.message);
      throw new Error(`Failed to create legend: ${error.message}`);
    }
  }

  // 🟡 Update legend details
  async updateLegend(legend_id, data) {
    try {
        // Validate ID and data
        if (!legend_id || isNaN(legend_id)) throw new Error("Invalid legend ID");
        if (!data || Object.keys(data).length === 0) throw new Error("No data provided for update");

        // Perform update via repository
        const legendg = await this.LegendsRepository.update(legend_id, data);

        // Return updated DTO if exists
        return legendg ? LegendsDTO.fromEntity(legendg) : null;
    } catch (error) {
        throw new Error(`Failed to update legend: ${error.message}`);
    }
  }

  // 🔴 Delete a legend
  async deleteLegend(legend_id) {
    try {
        // Validate ID
        if (!legend_id || isNaN(legend_id)) throw new Error("Invalid legend ID");

        // Delete via repository
        await this.LegendsRepository.deleteById(legend_id);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete legend: ${error.message}`);
    }
  }
}
