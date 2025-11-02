// Import validationResult from express-validator to handle input validation results
import { validationResult } from "express-validator";

// Controller responsible for handling HTTP requests related to Items.
// It acts as the link between the client requests (routes) and the service layer.
export class ItemsController {
    constructor(ItemsService) {
        // Inject the ItemsService (business logic layer)
        this.ItemsService = ItemsService;
    }

    // 🔴 DELETE /items/:item_id
    // Deletes an item by its ID
    async deleteItem(req, res) {
        try {
            // Validate request params and body using express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return 400 Bad Request with validation errors
                return res.status(400).json({ errors: errors.array() });
            }

            // Attempt to delete the item using the service
            const ok = await this.ItemsService.deleteItem(req.params.item_id);

            // If item not found, return 404 Not Found
            if (!ok) {
                return res.status(404).json({ message: "Item not found" });
            }

            // If deleted successfully, respond with success message
            res.status(200).json({ message: "Item deleted successfully" });
        } catch (error) {
            // Catch unexpected server errors and return 500 Internal Server Error
            res.status(500).json({ error: "Internal Server Error" });
        }   
    }

    // 🟡 PUT /items/:item_id
    // Updates an existing item’s details
    async updateItem(req, res) {
        try {
            // Validate request data
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If validation fails, respond with 400 and list of validation issues
                return res.status(400).json({ errors: errors.array() });
            }

            // Update item using service and request body
            const item = await this.ItemsService.updateItem(req.params.item_id, req.body);

            // Respond with 200 OK and updated item data
            res.status(200).json(item);
        } catch (error) {
            // Handle any unexpected server-side issues
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🟢 POST /items
    // Creates a new item record
    async createItem(req, res) {
        try {
            // Validate incoming request body
            const errors = validationResult(req);   
            if (!errors.isEmpty()) {
                // If validation failed, respond with 400 and validation details
                return res.status(400).json({ errors: errors.array() });
            }

            // Call service to create new item with data from request body
            const item = await this.ItemsService.createItem(req.body);

            // Return the newly created item with 201 Created
            res.status(201).json(item);
        } catch (error) {
            // Generic server error handling
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔍 GET /items/:item_id
    // Fetches a single item by its ID
    async getItemById(req, res) {
        try {
            // Validate route parameters
            const errors = validationResult(req);   
            if (!errors.isEmpty()) {
                // If validation failed, respond with 400
                return res.status(400).json({ errors: errors.array() });
            }

            // Fetch item record by ID through service
            const item = await this.ItemsService.getItemById(req.params.item_id);

            // If not found, respond with 404 Not Found
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            // If found, respond with item data and 200 OK
            res.status(200).json(item);
        } catch (error) {
            // Handle internal errors gracefully
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔹 GET /items
    // Retrieves all items from the database
    async listItems(req, res) {
        try {
            // Fetch all items via service
            const items = await this.ItemsService.listItems();

            // Return list of items with 200 OK
            res.status(200).json(items);
        } catch (error) {
            // Generic error handling for unexpected issues
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
