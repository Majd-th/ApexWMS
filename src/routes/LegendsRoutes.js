import { Router } from "express";
import { LegendsRepository } from "../domain/repositories/LegendsRepository.js";
import { LegendsService } from "../services/LegendsService.js";
import { LegendsController } from "../controllers/LegendsController.js";
import { idParam, upsertLegends } from "../validators/LegendsValidators.js";

const repo = new LegendsRepository();
const service = new LegendsService(repo);
const controller = new LegendsController(service);

export const legendsRoutes = Router();

/* ======================================================
   ADMIN HTML ROUTES (STATIC FIRST!)
   ====================================================== */
/* ---------- ADMIN HTML ROUTES ---------- */
legendsRoutes.get("/manage", controller.managePage);

legendsRoutes.post("/manage", upsertLegends, controller.createFromForm);

legendsRoutes.post("/:legend_id/delete", idParam, controller.deleteFromForm);

legendsRoutes.get("/:legend_id/edit", idParam, controller.editPage);

legendsRoutes.post("/:legend_id/edit", [...idParam, ...upsertLegends], controller.updateFromForm);

/* ======================================================
   JSON API ROUTES (DYNAMIC LAST!)
   ====================================================== */

// GET all legends
legendsRoutes.get("/", controller.listLegends);

// GET legend by ID
legendsRoutes.get("/:legend_id", idParam, controller.getLegendById);

// CREATE legend
legendsRoutes.post("/", upsertLegends, controller.createLegend);

// UPDATE legend
legendsRoutes.put(
  "/:legend_id",
  [...idParam, ...upsertLegends],
  controller.updateLegend
);

// DELETE legend
legendsRoutes.delete("/:legend_id", idParam, controller.deleteLegend);
