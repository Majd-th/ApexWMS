// Import validationResult from express-validator to handle request input validation results
import { validationResult } from "express-validator";

// Controller class that manages all HTTP operations related to Legends (create, read, update, delete).
// It connects API endpoints to the business logic in LegendsService.
export class LegendsController {
    constructor(LegendsService) {
        // Inject the LegendsService dependency — contains the core logic and database interactions
        this.LegendsService = LegendsService;
    }

    // 🟢 POST /legends
    // Creates a new legend record in the system
    async createLegend(req, res) {
        try {
            // Validate the request using express-validator middleware
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If validation fails, respond with 400 and list of validation errors
                return res.status(400).json({ errors: errors.array() });
            }

            // Call the LegendsService to create a new legend using the provided request body
            const legend = await this.LegendsService.createLegend(req.body);

            // Respond with 201 (Created) and the newly created legend
            res.status(201).json(legend);
        } catch (error) {
            // Handle unexpected errors, such as database or internal logic failures
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔍 GET /legends/:legend_id
    // Retrieves a single legend by its unique ID
    async getLegendById(req, res) {
        try {
            // Validate incoming parameters
            const errors = validationResult(req);
            if (!errors.isEmpty()) {    
                // Return validation errors if any
                return res.status(400).json({ errors: errors.array() });
            }

            // Use service layer to find the legend by ID
            const legend = await this.LegendsService.getLegendById(req.params.legend_id);

            // If legend not found, respond with 404
            if (!legend) {
                return res.status(404).json({ message: "Legend not found" });
            }

            // Respond with 200 (OK) and the found legend
            res.status(200).json(legend);
        } catch (error) {
            // Catch and handle server errors gracefully
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔹 GET /legends
    // Retrieves all legends from the database
    async listLegends(req, res) {
        try {
            // Call the service to fetch all legends
            const legends = await this.LegendsService.listLegends();

            // Return list of legends with 200 (OK)
            res.status(200).json(legends);
        } catch (error) {
            // Log detailed stack trace for debugging
            console.error("❌ LegendsController.listLegends error:", error.stack || error);
            // Return 500 error with message
            res.status(500).json({ error: error.message });
        }
    }

    // 🟡 PUT /legends/:legend_id
    // Updates an existing legend’s data
    async updateLegend(req, res) {
        try {
            // Validate incoming request fields
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If validation fails, send a 400 response
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service method to update the legend with provided data
            const updatedLegend = await this.LegendsService.updateLegend(req.params.legend_id, req.body);

            // If no record found, respond with 404
            if (!updatedLegend) {
                return res.status(404).json({ message: "Legend not found" });
            }

            // Respond with 200 and updated legend info
            res.status(200).json(updatedLegend);
        } catch (error) {
            // Handle internal issues (DB errors, invalid data, etc.)
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔴 DELETE /legends/:legend_id
    // Deletes a legend record by its ID
    async deleteLegend(req, res) {
        try {   
            // Validate route parameters
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return 400 Bad Request if validation fails
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service to delete legend
            const deleted = await this.LegendsService.deleteLegend(req.params.legend_id);

            // If legend doesn’t exist, return 404
            if (!deleted) {
                return res.status(404).json({ message: "Legend not found" });
            }

            // If deleted successfully, send confirmation
            res.status(200).json({ message: "Legend deleted successfully" });
        } catch (error) {
            // Handle generic errors
            res.status(500).json({ error: "Internal Server Error" });
        }   
    }
}
