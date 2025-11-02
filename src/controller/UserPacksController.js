// Import validationResult from express-validator to handle route validation errors
import { validationResult } from "express-validator";

// Controller class responsible for managing routes related to user packs (packs owned by users).
// It connects HTTP routes to the business logic layer (UserPacksService).
export class UserPacksController {
    constructor(UserPacksService) {
        // Inject the UserPacksService which handles DB operations and core logic
        this.UserPacksService = UserPacksService;

        // 🧭 Bind instance methods to maintain correct 'this' context when passed to route handlers.
        // Without .bind(this), 'this' could become undefined when these methods are used directly in routes.
        // Example:
        // app.get("/packs", userPacksController.list); ❌ loses context
        // app.get("/packs", userPacksController.list.bind(userPacksController)); ✅ fixed
        this.list = this.list.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.create = this.create.bind(this);
        this.checkOwnership = this.checkOwnership.bind(this);
    }

    // 🧩 Helper method for validating incoming requests
    _validate(req, res) {
        // Extract errors from express-validator middleware
        const errors = validationResult(req);

        // If validation failed, respond with 400 (Bad Request)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            // Return false to indicate failure and prevent execution of the main function
            return false;
        }

        // Return true if validation passed
        return true;
    }

    // 🔹 GET /user-packs
    // Lists all user-pack associations (every pack owned by every user)
    async list(req, res, next) {
        try {
            // Fetch all user packs via the service
            res.json(await this.UserPacksService.getUserPacks());
        } catch (e) {
            // Forward unexpected errors to Express error middleware
            next(e);
        }
    }

    // 🔍 GET /users/:user_id/packs
    // Retrieves all packs owned by a specific user
    async getByUserId(req, res, next) {
        try {
            // Validate parameters before proceeding
            if (!this._validate(req, res)) return;

            // Call service to retrieve packs belonging to a given user ID
            const data = await this.UserPacksService.getUserPacksByUserId(req.params.user_id);

            // If user not found or has no packs, respond with 404 Not Found
            if (!data) return res.status(404).json({ message: "Not found" });

            // Respond with 200 OK and the user's packs
            res.status(200).json(data);
        } catch (e) {
            // Handle unexpected errors
            next(e);
        }
    }

    // 🟢 POST /user-packs
    // Adds a new user-pack record (when a user obtains or purchases a pack)
    async create(req, res, next) {
        try {
            // Validate request body (ensure all required fields are present)
            if (!this._validate(req, res)) return;

            // Call service to add a pack record for the user
            const data = await this.UserPacksService.addUserPack(req.body);

            // Respond with 201 Created and new user-pack data
            res.status(201).json(data);
        } catch (e) {
            // Pass internal errors to middleware for centralized handling
            next(e);
        }
    }

    // 🔎 GET /users/:user_id/packs/:pack_id/ownership
    // Checks whether a specific user owns a specific pack
    async checkOwnership(req, res, next) {
        try {
            // Validate parameters before calling service
            if (!this._validate(req, res)) return;

            // Destructure route parameters for clarity
            const { user_id, pack_id } = req.params;

            // Call service to check ownership
            const ownsPack = await this.UserPacksService.checkUserOwnsPack(user_id, pack_id);

            // Respond with JSON indicating true/false ownership
            res.status(200).json({ ownsPack });
        } catch (error) {
            // Forward any unexpected error to Express middleware
            next(error);
        }
    }
}
