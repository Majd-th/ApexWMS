// src/routes/UserPacksRoutes.js
import { Router } from "express";                               // Express router
import { UserPacksController } from "../controller/UserPacksController.js"; // Controller
import { UserPacksService } from "../service/UserPacksService.js";           // Service
import { UserPacksRepository } from "../domain/Repositories/UserPacksRepository.js"; // Repo
import { idParam, upsertUserPacks, userIdParam } from "../validators/UserPacksValidators.js"; // Validation

export const userPacksRoutes = Router();                        // Named export router

const repo = new UserPacksRepository();                         // Repo instance
const service = new UserPacksService(repo);                     // Service instance
const controller = new UserPacksController(service);             // Controller instance

// Define endpoints
userPacksRoutes.get("/user/:user_id", userIdParam, controller.getByUserId); // GET packs owned by a user
userPacksRoutes.get("/check/:user_id/:pack_id", idParam, controller.checkOwnership); // GET check if user owns pack

//console.log("✅ <UserPacks>Routes loaded");                      // Log confirmation
