import { Router } from "express";
import { UserItemsRepository } from "../domain/repositories/UserItemsRepository.js";
import { UserItemsService } from "../services/UserItemsService.js";
import { UserItemsController } from "../controllers/UserItemsController.js";
import { param } from "express-validator";

export const userItemsRoutes = Router();

// -------------------------
// VALIDATORS
// -------------------------
const userIdParam = [
  param("user_id").isInt({ gt: 0 }).withMessage("user_id must be a positive integer")
];

const itemIdParam = [
  param("item_id").isInt({ gt: 0 }).withMessage("item_id must be a positive integer")
];

// -------------------------
// Init Repo → Service → Controller
// -------------------------
const repo = new UserItemsRepository();
const service = new UserItemsService(repo);
const controller = new UserItemsController(service);

// -------------------------
// ROUTES
// -------------------------

// GET all items owned by a user
userItemsRoutes.get(
  "/user/:user_id",
  userIdParam,
  controller.getByUserId
);

// Check if user owns an item
userItemsRoutes.get(
  "/ownership/user/:user_id/item/:item_id",
  [...userIdParam, ...itemIdParam],
  controller.checkOwnership
);

// Admin create user item (optional)
userItemsRoutes.post(
  "/",
  controller.create
);

export default userItemsRoutes;
