import { Router } from "express";
import { AbilitiesRepository } from "../domain/repositories/AbilitiesRepository.js";
import { AbilitiesService } from "../services/AbilitiesService.js";
import { AbilitiesController } from "../controllers/AbilitiesController.js";
import { idParam, upsertAbilities } from "../validators/AbilitiesValidators.js";

const repo = new AbilitiesRepository();
const service = new AbilitiesService(repo);
const controller = new AbilitiesController(service);

export const abilitiesRoutes = Router();

/* ======================================================
   ADMIN HTML ROUTES  (STATIC FIRST!)
   ====================================================== */

// GET manage abilities for a legend
abilitiesRoutes.get("/manage/:legend_id", controller.manageForLegend);

// POST create ability from legend page
abilitiesRoutes.post("/manage/:legend_id", controller.createForLegend);

// DELETE ability from legend page
abilitiesRoutes.post(
  "/manage/:legend_id/:ability_id/delete",
  controller.deleteFromLegend
);

// EDIT ability for a legend (show form)
abilitiesRoutes.get(
  "/manage/:legend_id/:ability_id/edit",
  controller.editForLegend
);

// UPDATE ability for legend (submit form)
abilitiesRoutes.post(
  "/manage/:legend_id/:ability_id/edit",
  controller.updateForLegend
);

/* ======================================================
   JSON API ROUTES 
   ====================================================== */

// Get abilities by legend_id
abilitiesRoutes.get("/:legend_id", idParam, controller.getByLegend.bind(controller));

// Update ability by ability_id
abilitiesRoutes.put(
  "/:ability_id",
  [...idParam, ...upsertAbilities],
  controller.update.bind(controller)
);

// Create ability
abilitiesRoutes.post("/", upsertAbilities, controller.create.bind(controller));

// Delete ability
abilitiesRoutes.delete("/:ability_id", idParam, controller.delete.bind(controller));
