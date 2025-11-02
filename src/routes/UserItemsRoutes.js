import { Router } from "express";                               // Import Express Router
import { UserItemsController } from "../controller/UserItemsController.js"; // Controller import
import { UserItemsService } from "../service/UserItemsService.js";           // Service layer
import { UserItemsRepository } from "../domain/Repositories/UserItemsRepository.js"; // Repository

export const userItemsRoutes = Router();                        // Export router

// Initialize instances
const userItemsRepository = new UserItemsRepository();
const userItemsService = new UserItemsService(userItemsRepository);
const userItemsController = new UserItemsController(userItemsService);

// Define routes
userItemsRoutes.get("/user/:user_id", userItemsController.getByUserId); // GET all items of a user
//userItemsRoutes.post("/", userItemsController.create);                  // POST add new item to user (admin use)
userItemsRoutes.get("/ownership/user/:user_id/item/:item_id", userItemsController.checkOwnership); // GET check if user owns item

//console.log("✅ <UserItems>Routes loaded");                    // Confirm route registration
