// Import validationResult from express-validator to handle request validation errors
import { validationResult } from "express-validator";

// Controller responsible for handling HTTP requests related to Abilities.
// It connects the routes with the service layer and manages responses.
export class AbilitiesController {
    constructor(AbilitiesService) {
        // Inject the AbilitiesService dependency (contains business logic)
        this.AbilitiesService = AbilitiesService;
    }

    // 🔹 GET /legends/:legend_id/abilities
    // Retrieves all abilities that belong to a specific legend
    async getByLegend(req, res) {
        try {
            // Extract legend_id from URL parameters and fetch abilities
            const abilities = await this.AbilitiesService.getAbilitiesByLegend(req.params.legend_id);

            // Respond with a 200 (OK) and the list of abilities as JSON
            res.status(200).json(abilities);
        } catch (e) {
            // Handle unexpected errors and respond with HTTP 500
            res.status(500).json({ error: e.message });
        }
    }

    // 🟢 POST /abilities
    // Creates a new ability record for a legend
    async create(req, res) {
        try {
            // Validate request data using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) 
                // If validation fails, return 400 (Bad Request) with error details
                return res.status(400).json({ errors: errors.array() });

            // Pass validated body data to the service to create a new ability
            const ability = await this.AbilitiesService.createAbility(req.body);

            // Return the newly created ability with HTTP 201 (Created)
            res.status(201).json(ability);
        } catch (e) {
            // Internal error (e.g., database issue)
            res.status(500).json({ error: e.message });
        }
    }

    // 🟡 PUT /abilities/:ability_id
    // Updates an existing ability record
    async update(req, res) {
        try {
            // Call service to update ability based on ID and new data
            const ability = await this.AbilitiesService.updateAbility(req.params.ability_id, req.body);

            // If not found, return 404 (Not Found)
            if (!ability) 
                return res.status(404).json({ message: "Ability not found" });

            // Return updated ability with 200 (OK)
            res.status(200).json(ability);
        } catch (e) {
            // Handle unexpected errors
            res.status(500).json({ error: e.message });
        }
    }

    // 🔴 DELETE /abilities/:ability_id
    // Deletes an existing ability
    async delete(req, res) {
        try {
            // Call service to delete the ability by its ID
            const deleted = await this.AbilitiesService.deleteAbility(req.params.ability_id);

            // If nothing deleted (invalid ID), return 404
            if (!deleted) 
                return res.status(404).json({ message: "Ability not found" });

            // If success, send confirmation message
            res.status(200).json({ message: "Ability deleted" });
        } catch (e) {
            // Handle internal errors
            res.status(500).json({ error: e.message });
        }
    }

    // 🔹 GET /legends/:legend_id/abilities/:ability_id
    // Retrieves one specific ability that belongs to a specific legend
    async getByLegendAndAbility(req, res) {
        try {
            // Extract both parameters from the route
            const { legend_id, ability_id } = req.params;

            // Call service to fetch matching ability
            const result = await this.AbilitiesService.getByLegendAndAbility(legend_id, ability_id);

            // Return found ability with status 200
            res.status(200).json(result);
        } catch (error) {
            // If not found or invalid data, return 404
            res.status(404).json({ error: error.message });
        }
    }
}
