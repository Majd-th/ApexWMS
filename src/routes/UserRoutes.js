import { Router } from "express";                               // Express Router import
import {UserRepository} from '../domain/Repositories/UserRepository.js'; // Repository import
import { UserService } from "../service/UserService.js";         // Service import
import { UserController } from "../controller/UserController.js"; // Controller import
import { idParam, upsertUsers } from "../validators/UserValidators.js"; // Validator import

const repo = new UserRepository();                              // Repository instance
const service = new UserService(repo);                          // Service instance
const controller = new UserController(service);                  // Controller instance

export const userRoutes = Router();                             // Export router for app.js

// Define endpoints
userRoutes.get("/", controller.list);                           // GET all users
userRoutes.get("/:user_id", idParam, controller.get);            // GET user by ID
userRoutes.put("/:user_id", [...idParam, ...upsertUsers], controller.update); // PUT update user
userRoutes.post("/", upsertUsers, controller.create);            // POST new user
userRoutes.delete("/:user_id", idParam, controller.delete);      // DELETE user
//console.log("✅ <User>Routes loaded");                           // Debug log for route load confirmation
