// Import validationResult from express-validator
import { validationResult } from "express-validator";

// Controller responsible for handling HTTP requests related to Items.
export class ItemsController {

    constructor(ItemsService) {
        this.ItemsService = ItemsService;

        // Bind methods so Router can call them safely
        this.listItems = this.listItems.bind(this);
        this.getItemById = this.getItemById.bind(this);
        this.createItem = this.createItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        // View-related bindings
        this.renderManagePage = this.renderManagePage.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);
        this.updateFromView = this.updateFromView.bind(this);
        this.deleteFromView = this.deleteFromView.bind(this);
    }

    // ============================================================
    // API CONTROLLERS (JSON RESPONSES)
    // ============================================================

    async listItems(req, res) {
        try {
            const items = await this.ItemsService.listItems();
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getItemById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const item = await this.ItemsService.getItemById(req.params.item_id);

            if (!item)
                return res.status(404).json({ message: "Item not found" });

            res.status(200).json(item);

        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createItem(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const item = await this.ItemsService.createItem(req.body);
            res.status(201).json(item);

        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateItem(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const updated = await this.ItemsService.updateItem(
                req.params.item_id,
                req.body
            );

            res.status(200).json(updated);

        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteItem(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const ok = await this.ItemsService.deleteItem(req.params.item_id);

            if (!ok)
                return res.status(404).json({ message: "Item not found" });

            res.status(200).json({ message: "Item deleted successfully" });

        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // ============================================================
    // ADMIN PANEL (EJS VIEWS)
    // ============================================================

    async renderManagePage(req, res) {
        try {
            const items = await this.ItemsService.listItems();
            res.render("items/manage", { items });
        } catch (err) {
            res.status(500).send("Error loading items: " + err.message);
        }
    }

    async renderEditPage(req, res) {
        try {
            const item = await this.ItemsService.getItemById(req.params.item_id);

            if (!item) return res.status(404).send("Item not found");

            res.render("items/edit", { item });

        } catch (err) {
            res.status(500).send("Error loading item: " + err.message);
        }
    }

    // Handles form submission from edit page
    async updateFromView(req, res) {
        try {
            await this.ItemsService.updateItem(req.params.item_id, req.body);

            res.redirect("/api/items/manage");

        } catch (err) {
            res.status(500).send("Error updating item: " + err.message);
        }
    }

    async deleteFromView(req, res) {
        try {
            const ok = await this.ItemsService.deleteItem(req.params.item_id);

            if (!ok) return res.status(404).send("Item not found");

            res.redirect("/api/items/manage");

        } catch (err) {
            res.status(500).send("Error deleting item: " + err.message);
        }
    }
}
