
// src/routes/LegendsRoutes.js
import { Router } from "express";                               // Express router setup
import { AbilitiesRepository } from "../domain/Repositories/AbilitiesRepository.js"; // Needed for linked logic
import { LegendsRepository } from "../domain/Repositories/LegendsRepository.js";     // Legends data source
import { LegendsService } from "../service/LegendsService.js";                     // Combines logic between repos
import { LegendsController } from "../controller/LegendsController.js";             // Manages HTTP endpoints
import { idParam, upsertLegends } from "../validators/LegendsValidators.js";        // Validation rules

export const legendsRoutes = Router();                          // Named export (imported in app.js)

const legendsRepo = new LegendsRepository();                    // Legends repository instance
const abilitiesRepo = new AbilitiesRepository();                // Abilities repository instance

const legendsService = new LegendsService(legendsRepo, abilitiesRepo); // Combines both into logic layer
const legendsController = new LegendsController(legendsService);       // Controller setup

// Define API endpoints for Legends
legendsRoutes.get("/", legendsController.listLegends.bind(legendsController));           // GET all legends
legendsRoutes.get("/:legend_id", idParam, legendsController.getLegendById.bind(legendsController)); // GET one legend
legendsRoutes.post("/", upsertLegends, legendsController.createLegend.bind(legendsController));     // POST add legend
legendsRoutes.put("/:legend_id", [...idParam, ...upsertLegends], legendsController.updateLegend.bind(legendsController)); // PUT edit legend
legendsRoutes.delete("/:legend_id", idParam, legendsController.deleteLegend.bind(legendsController)); // DELETE legend

//console.log("✅ <Legends>Routes loaded successfully");           // Log confirming route file loaded
