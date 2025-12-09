// Import validationResult from express-validator — used to validate incoming API requests
import { validationResult } from "express-validator";

/**
 * Controller responsible for all PACK-related operations.
 *
 * This includes:
 *  - Listing all packs
 *  - Fetching one pack
 *  - Creating, updating, deleting packs
 *  - Handling pack purchase logic (API)
 *  - Handling pack opening logic (API)
 *  - Rendering admin views for managing packs (EJS)
 *
 * All database interactions and business logic are delegated to PackService.
 */
export class PackController {

    constructor(PackService) {
        // Inject business service
        this.PackService = PackService;

        // Bind API controllers
        this.listPacks = this.listPacks.bind(this);
        this.getPackById = this.getPackById.bind(this);
        this.createPack = this.createPack.bind(this);
        this.updatePack = this.updatePack.bind(this);
        this.deletePack = this.deletePack.bind(this);
        this.buyPack = this.buyPack.bind(this);
        this.openPack = this.openPack.bind(this);

        // Bind admin view controllers
        this.renderManagePage = this.renderManagePage.bind(this);
        this.createFromView = this.createFromView.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);
        this.updateFromView = this.updateFromView.bind(this);
        this.deleteFromView = this.deleteFromView.bind(this);
    }

    // ============================================================
    // API CONTROLLERS (JSON)
    // ============================================================

    /**
     * GET /api/packs
     * Returns a JSON list of all packs in the system.
     */
    async listPacks(req, res) {
        try {
            const packs = await this.PackService.listPacks();
            res.status(200).json(packs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /api/packs/:pack_id
     * Returns details of a specific pack by ID.
     */
    async getPackById(req, res) {
        try {
            const pack = await this.PackService.getPackById(req.params.pack_id);

            if (!pack)
                return res.status(404).json({ message: "Pack not found" });

            res.status(200).json(pack);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * POST /api/packs
     * Creates a new pack (JSON API).
     */
    async createPack(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const pack = await this.PackService.createPack(req.body);

            res.status(201).json(pack);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * PUT /api/packs/:pack_id
     * Updates pack details.
     */
    async updatePack(req, res) {
        try {
            const pack = await this.PackService.updatePack(req.params.pack_id, req.body);

            if (!pack)
                return res.status(404).json({ message: "Pack not found" });

            res.status(200).json(pack);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * DELETE /api/packs/:pack_id
     * Deletes a pack by ID.
     */
    async deletePack(req, res) {
        try {
            const deleted = await this.PackService.deletePack(req.params.pack_id);

            if (!deleted)
                return res.status(404).json({ message: "Pack not found" });

            res.status(200).json({ message: "Pack deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * POST /api/packs/:user_id/buy/:pack_id
     * Handles pack purchase through the API (not the EJS store).
     */
    async buyPack(req, res) {
        try {
            const result = await this.PackService.buyPack(
                req.params.user_id,
                req.params.pack_id
            );

            res.status(200).json(result);
        } catch (err) {
            console.error("BUY PACK ERROR:", err);
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * POST /api/packs/:user_id/open/:pack_id
     * Opens a pack owned by a user and returns the generated reward.
     */
    async openPack(req, res) {
        try {
            const result = await this.PackService.openPack(
                req.params.user_id,
                req.params.pack_id
            );

            res.status(200).json(result);
        } catch (err) {
            console.error("OPEN PACK ERROR:", err);
            res.status(400).json({ error: err.message });
        }
    }

    // ============================================================
    // ADMIN PANEL EJS VIEW CONTROLLERS
    // ============================================================

    /**
     * GET /api/packs/manage
     * Renders a page listing all packs for administrative management.
     */
    async renderManagePage(req, res) {
        try {
            const packs = await this.PackService.listPacks();
            res.render("packs/manage", { packs });
        } catch (err) {
            res.status(500).send("Error loading packs: " + err.message);
        }
    }

    /**
     * POST /api/packs/manage
     * Creates a new pack via admin HTML form.
     */
    async createFromView(req, res) {
        try {
            await this.PackService.createPack(req.body);
            res.redirect("/api/packs/manage");
        } catch (err) {
            res.status(400).send("Error creating pack: " + err.message);
        }
    }

    /**
     * GET /api/packs/edit/:pack_id
     * Renders an HTML form to edit an existing pack.
     */
    async renderEditPage(req, res) {
        try {
            const pack = await this.PackService.getPackById(req.params.pack_id);

            if (!pack)
                return res.status(404).send("Pack not found");

            res.render("packs/edit", { pack });
        } catch (err) {
            res.status(500).send("Error loading pack: " + err.message);
        }
    }

    /**
     * POST /api/packs/edit/:pack_id
     * Saves updates made to a pack from the admin HTML form.
     */
    async updateFromView(req, res) {
        try {
            await this.PackService.updatePack(req.params.pack_id, req.body);
            res.redirect("/api/packs/manage");
        } catch (err) {
            res.status(400).send("Error updating pack: " + err.message);
        }
    }

    /**
     * POST /api/packs/:pack_id/delete
     * Deletes a pack via HTML form submission.
     */
    async deleteFromView(req, res) {
        try {
            await this.PackService.deletePack(req.params.pack_id);
            res.redirect("/api/packs/manage");
        } catch (err) {
            res.status(400).send("Error deleting pack: " + err.message);
        }
    }
}
