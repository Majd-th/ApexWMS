// Import validationResult from express-validator — used to validate request input
import { validationResult } from "express-validator";

/**
 * Controller responsible for all LEGEND-related operations.
 *
 * This includes:
 *  - Creating legends (API + Admin)
 *  - Listing legends
 *  - Fetching an individual legend
 *  - Updating legend data
 *  - Deleting a legend
 *  - Rendering admin management pages (EJS)
 *
 * All core business logic is delegated to LegendsService.
 */
export class LegendsController {
    constructor(LegendsService) {
        this.LegendsService = LegendsService;

        // Bind API methods
        this.createLegend   = this.createLegend.bind(this);
        this.getLegendById  = this.getLegendById.bind(this);
        this.listLegends    = this.listLegends.bind(this);
        this.updateLegend   = this.updateLegend.bind(this);
        this.deleteLegend   = this.deleteLegend.bind(this);

        // Bind admin view methods
        this.managePage     = this.managePage.bind(this);
        this.createFromForm = this.createFromForm.bind(this);
        this.deleteFromForm = this.deleteFromForm.bind(this);
        this.editPage       = this.editPage.bind(this);
        this.updateFromForm = this.updateFromForm.bind(this);
    }

    // ============================================================
    // API CONTROLLERS (JSON)
    // ============================================================

    /**
     * POST /api/legends
     * Creates a new legend.
     */
    async createLegend(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const legend = await this.LegendsService.createLegend(req.body);

            return res.status(201).json(legend);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * GET /api/legends/:legend_id
     * Retrieves a single legend by ID.
     */
    async getLegendById(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const legend = await this.LegendsService.getLegendById(req.params.legend_id);

            if (!legend)
                return res.status(404).json({ message: "Legend not found" });

            return res.status(200).json(legend);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * GET /api/legends
     * Returns a list of all legends.
     */
    async listLegends(req, res) {
        try {
            const legends = await this.LegendsService.listLegends();
            return res.status(200).json(legends);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * PUT /api/legends/:legend_id
     * Updates legend details.
     */
    async updateLegend(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const updatedLegend = await this.LegendsService.updateLegend(
                req.params.legend_id,
                req.body
            );

            if (!updatedLegend)
                return res.status(404).json({ message: "Legend not found" });

            return res.status(200).json(updatedLegend);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * DELETE /api/legends/:legend_id
     * Deletes a legend.
     */
    async deleteLegend(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const deleted = await this.LegendsService.deleteLegend(req.params.legend_id);

            if (!deleted)
                return res.status(404).json({ message: "Legend not found" });

            return res.status(200).json({ message: "Legend deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // ============================================================
    // ADMIN PANEL VIEW CONTROLLERS (EJS)
    // ============================================================

    /**
     * GET /api/legends/manage
     * Renders a list of all legends for admin management.
     */
    async managePage(req, res, next) {
        try {
            const legends = await this.LegendsService.listLegends();
            return res.render("legends/manage", { legends });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/legends/manage
     * Creates a new legend through an HTML form.
     */
    async createFromForm(req, res, next) {
        try {
            await this.LegendsService.createLegend(req.body);
            return res.redirect("/api/legends/manage");
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/legends/:legend_id/delete
     * Deletes a legend through the admin panel form.
     */
    async deleteFromForm(req, res, next) {
        try {
            await this.LegendsService.deleteLegend(req.params.legend_id);
            return res.redirect("/api/legends/manage");
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/legends/:legend_id/edit
     * Renders an edit form for a specific legend.
     */
    async editPage(req, res, next) {
        try {
            const legend = await this.LegendsService.getLegendById(req.params.legend_id);

            if (!legend)
                return res.status(404).send("Legend not found");

            return res.render("legends/edit", { legend });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/legends/:legend_id/edit
     * Updates a legend based on form submission.
     */
    async updateFromForm(req, res, next) {
        try {
            await this.LegendsService.updateLegend(req.params.legend_id, req.body);
            return res.redirect("/api/legends/manage");
        } catch (error) {
            next(error);
        }
    }
}
