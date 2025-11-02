import { Router } from "express";                               // Import Express Router for defining endpoints
import { AbilitiesRepository } from "../domain/Repositories/AbilitiesRepository.js"; // Repository handles DB queries
import { AbilitiesService } from "../service/AbilitiesService.js";                    // Service handles logic between repo and controller
import { AbilitiesController } from "../controller/AbilitiesController.js";           // Controller handles HTTP requests/responses
import { idParam, upsertAbilities } from "../validators/AbilitiesValidators.js";      // Input validation middleware

// Create instances for routing layer
const repo = new AbilitiesRepository();                         // Creates repo instance to access DB
const service = new AbilitiesService(repo);                     // Service wraps repo with extra logic
const controller = new AbilitiesController(service);             // Controller connects Express routes with service

export const    abilitiesRoutes  = Router();                        // Export router so app.js can use it

// Route: GET abilities by legend_id (e.g., /api/abilities/3)
abilitiesRoutes.get("/:legend_id", idParam, controller.getByLegend.bind(controller));

// Route: PUT update ability by ability_id (validates both params and body)
abilitiesRoutes.put("/:ability_id", [...idParam, ...upsertAbilities], controller.update.bind(controller));

// Route: POST create new ability (requires full ability info)
abilitiesRoutes.post("/", upsertAbilities, controller.create.bind(controller));

// Route: DELETE ability by ID
abilitiesRoutes.delete("/:ability_id", idParam, controller.delete.bind(controller));

// Log to confirm router loaded successfully during server startup
//console.log("✅ <Abilities>Routes loaded");
