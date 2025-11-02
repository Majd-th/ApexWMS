// Import validationResult from express-validator to handle input validation results
import { validationResult } from "express-validator";

// Controller class that manages routes related to User Items.
// It connects API requests (HTTP) to the UserItemsService, which handles the business logic.
export class UserItemsController {
    constructor(UserItemsService) {
        // Inject the UserItemsService dependency — handles database operations and logic
        this.UserItemsService = UserItemsService;
    }

    // 🧩 Helper method for validating request inputs using express-validator
    _validate(req, res) {
        // Extract validation errors from the request
        const errors = validationResult(req);

        // If validation fails, return HTTP 400 (Bad Request) with details
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Return null if no validation errors exist
        return null;
    }

    // 🔹 GET /user-items
    // Retrieves a list of all user-item relations (every user and their items)
    list = async (req, res, next) => {
        try {
            // Fetch all user-item records from the service
            res.json(await this.UserItemsService.getUserItems());
        } catch (e) {
            // Pass unexpected errors to Express’s centralized error handler
            next(e);
        }
    };

    // 🔍 GET /users/:user_id/items
    // Fetches all items owned by a specific user
    getByUserId = async (req, res, next) => {
        try {
            // Validate route params
            if (this._validate(req, res)) return;

            // Call service to retrieve items by user ID
            const data = await this.UserItemsService.getUserItemsByUserId(req.params.user_id);

            // If no data found, respond with 404 Not Found
            if (!data) return res.status(404).json({ message: "Not found" });

            // If successful, respond with user’s items
            res.status(200).json(data);
        } catch (e) {
            // Forward errors to error-handling middleware
            next(e);
        }
    };

    // 🟢 POST /user-items
    // Adds an item to a user’s inventory (creates a user-item record)
    create = async (req, res, next) => {
        try {
            // Validate body data (user_id, item_id, etc.)
            if (this._validate(req, res)) return;

            // Call service to add item to a user
            const data = await this.UserItemsService.addItemToUser(
                req.body.user_id,
                req.body.item_id,
                req.body.aquired_at // Date when the item was obtained
            );

            // Respond with 201 Created and new record
            res.status(201).json(data);
        } catch (e) {
            // Pass any unexpected errors to the middleware
            next(e);
        }
    };

    // 🔎 GET /users/:user_id/items/:item_id/ownership
    // Checks if a specific user owns a specific item
    checkOwnership = async (req, res, next) => {
        try {
            // Validate request parameters
            if (this._validate(req, res)) return;

            // Call service to check ownership of item
            const ownsItem = await this.UserItemsService.checkUserOwnsItem(
                req.params.user_id,
                req.params.item_id
            );

            // Respond with a boolean indicating ownership
            res.status(200).json({ ownsItem });
        } catch (e) {
            // Forward errors to middleware
            next(e);
        }
    };

    // 🔹 GET /user-items/:user_id
    // Retrieves all user-item associations for a specific user (alternative route)
    getUserItems = async (req, res, next) => {
        try {
            // Validate request input
            if (this._validate(req, res)) return;

            // Fetch user’s items from the service
            const data = await this.UserItemsService.getUserItems(req.params.user_id);

            // If no items found, respond with 404
            if (!data) return res.status(404).json({ message: "Not found" });

            // Return 200 OK with user items
            res.status(200).json(data);
        } catch (e) {
            // Handle unexpected issues
            next(e);
        }
    };
}
