// Import validationResult from express-validator — used to check if validation middleware found any errors
import { validationResult } from "express-validator";

// Controller class that handles all HTTP requests related to Packs.
// It connects API routes to business logic in the PackService.
export class PackController {
    constructor(PackService) {
        // Inject the PackService dependency — contains all CRUD and transactional logic
        this.PackService = PackService;

        // Bind all methods to the class instance to ensure 'this' context works correctly
        // This is necessary when methods are used as Express route callbacks
        this.listPacks = this.listPacks.bind(this);
        this.getPackById = this.getPackById.bind(this);
        this.createPack = this.createPack.bind(this);
        this.updatePack = this.updatePack.bind(this);
        this.deletePack = this.deletePack.bind(this);
        this.buyPack = this.buyPack.bind(this);
        this.openPack = this.openPack.bind(this);
    }

    // 🔹 GET /packs
    // Fetches and returns all available packs
    async listPacks(req, res) {
        try {
            // Use PackService to get all packs
            const packs = await this.PackService.listPacks();

            // Respond with 200 OK and list of packs
            res.status(200).json(packs);
        } catch (e) {
            // Handle unexpected server errors
            res.status(500).json({ error: e.message });
        }
    }

    // 🔍 GET /packs/:pack_id
    // Retrieves a single pack by its ID
    async getPackById(req, res) {
        try {
            // Call service to fetch pack details
            const pack = await this.PackService.getPackById(req.params.pack_id);

            // If not found, respond with 404 Not Found
            if (!pack) return res.status(404).json({ message: "Pack not found" });

            // Return found pack
            res.status(200).json(pack);
        } catch (e) {
            // Return 500 Internal Server Error for unexpected issues
            res.status(500).json({ error: e.message });
        }
    }

    // 🟢 POST /packs
    // Creates a new pack record
    async createPack(req, res) {
        try {
            // Validate incoming data using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty())
                // If validation fails, send 400 Bad Request with error details
                return res.status(400).json({ errors: errors.array() });

            // Call service to create a new pack from request body data
            const pack = await this.PackService.createPack(req.body);

            // Respond with 201 Created and newly created pack
            res.status(201).json(pack);
        } catch (e) {
            // Handle server errors (e.g., database issues)
            res.status(500).json({ error: e.message });
        }
    }

    // 🟡 PUT /packs/:pack_id
    // Updates an existing pack by its ID
    async updatePack(req, res) {
        try {
            // Use service to update pack using provided ID and body data
            const pack = await this.PackService.updatePack(req.params.pack_id, req.body);

            // If pack doesn’t exist, send 404 Not Found
            if (!pack) return res.status(404).json({ message: "Pack not found" });

            // Return updated pack with 200 OK
            res.status(200).json(pack);
        } catch (e) {
            // Handle internal errors
            res.status(500).json({ error: e.message });
        }
    }

    // 🔴 DELETE /packs/:pack_id
    // Deletes a pack record by its ID
    async deletePack(req, res) {
        try {
            // Call service to delete the pack
            const deleted = await this.PackService.deletePack(req.params.pack_id);

            // If not found, return 404 Not Found
            if (!deleted) return res.status(404).json({ message: "Pack not found" });

            // If deleted successfully, send success message
            res.status(200).json({ message: "Pack deleted successfully" });
        } catch (e) {
            // Handle errors such as DB or logic failures
            res.status(500).json({ error: e.message });
        }
    }

    // 💰 POST /users/:user_id/packs/:pack_id/buy
    // Allows a user to purchase a pack using their coins
    async buyPack(req, res) {
        try {
            // Call service to execute pack purchase for a user
            const result = await this.PackService.buyPack(req.params.user_id, req.params.pack_id);

            // Respond with success message and transaction result
            res.status(200).json(result);
        } catch (e) {
            // If validation or logic fails (e.g., insufficient coins), respond with 400 Bad Request
             console.error("🔥 PACK ERROR:", e); // 👈 This will print the full error stack
  res.status(400).json({ error: e.message });

        }
    }

    // 🎁 POST /users/:user_id/packs/:pack_id/open
    // Opens a purchased pack and grants a random reward
    async openPack(req, res) {
        try {
            // Call service to open a pack for a user and get the reward
            const result = await this.PackService.openPack(req.params.user_id, req.params.pack_id);

            // Respond with 200 OK and reward details
            res.status(200).json(result);
        } catch (e) {
            // Return 400 Bad Request for logical or validation errors (e.g., user doesn’t own pack)
            console.error("🔥 PACK ERROR:", e); // 👈 This will print the full error stack
  res.status(400).json({ error: e.message });

        }
    }
}
// In JavaScript, when a class method is passed as a callback (for example, to Express routes),
// the original 'this' context (which refers to the class instance) can be lost.
// Using `.bind(this)` permanently binds the method to the current class instance,
// ensuring that inside the method, 'this' still refers to the controller object
// and not to something else like the Express request or undefined.
//
// Example problem without bind:
// app.get('/packs', packController.listPacks); // ❌ 'this' is undefined inside listPacks
//
// Fixed with bind:
// app.get('/packs', packController.listPacks.bind(packController)); // ✅ 'this' works correctly