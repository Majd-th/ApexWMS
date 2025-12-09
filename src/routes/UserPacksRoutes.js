// src/routes/UserPacksRoutes.js
import { Router } from "express";
import { UserPacksRepository } from "../domain/repositories/UserPacksRepository.js";
import { UserPacksService } from "../services/UserPacksService.js";
import { UserPacksController } from "../controllers/UserPacksController.js";
import { param } from "express-validator";

export const userPacksRoutes = Router();

// ----------------------
// VALIDATORS
// ----------------------
const userIdParam = [
    param("user_id").isInt({ gt: 0 }).withMessage("user_id must be a positive integer")
];

const packIdParam = [
    param("pack_id").isInt({ gt: 0 }).withMessage("pack_id must be a positive integer")
];

// ----------------------
// INIT LAYER STRUCTURE
// ----------------------
const repo = new UserPacksRepository();
const service = new UserPacksService(repo);
const controller = new UserPacksController(service);

// ----------------------
// ROUTES
// ----------------------

// GET all packs owned by a user
userPacksRoutes.get(
    "/user/:user_id",
    userIdParam,
    controller.getByUserId
);

// CHECK if user owns a specific pack
userPacksRoutes.get(
    "/ownership/:user_id/:pack_id",
    [...userIdParam, ...packIdParam],
    controller.checkOwnership
);

// ADMIN/INTERNAL: Create a user-pack record
userPacksRoutes.post(
    "/",
    controller.create
);

export default userPacksRoutes;
