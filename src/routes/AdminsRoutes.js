import { Router } from "express";                               // Express Router import
import { AdminsRepository } from "../domain/repositories/AdminsRepository.js";  // Admin repository
import { AdminsService } from "../services/AdminsService.js";                    // Handles admin logic
import { AdminsController } from "../controllers/AdminsController.js";           // Routes → Service connector
import { idParam, upsertAdmins } from "../validators/AdminsValidators.js";      // Validation middleware

const repo = new AdminsRepository();                            // Repository instance for DB communication
const service = new AdminsService(repo);                        // Service adds business logic
const controller = new AdminsController(service);                // Controller handles requests

export const adminsRoutes = Router();                           // Export router

// Define CRUD endpoints for admins
adminsRoutes.get("/", controller.listAdmins.bind(controller));         // GET all admins
adminsRoutes.get("/:admin_id", idParam, controller.getAdminById.bind(controller)); // GET single admin by ID
adminsRoutes.post("/", upsertAdmins, controller.createAdmin.bind(controller)); // POST create new admin
adminsRoutes.put("/:admin_id", [...idParam, ...upsertAdmins], controller.updateAdmin.bind(controller)); // PUT update admin

//console.log("✅ <Admins>Routes loaded");                        // Confirms route registration on startup
