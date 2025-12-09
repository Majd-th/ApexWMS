import { Router } from "express";
import { ItemsRepository } from "../domain/repositories/ItemsRepository.js";
import { ItemsService } from "../services/ItemsService.js";
import { ItemsController } from "../controllers/ItemsController.js";
import { idParam, upsertItems } from "../validators/ItemsValidators.js";

const repo = new ItemsRepository();
const service = new ItemsService(repo);
const controller = new ItemsController(service);

export const itemsRoutes = Router();

// ========================
// ADMIN GUI ROUTES (STATIC FIRST!!)
// ========================
itemsRoutes.get("/manage", controller.renderManagePage);
itemsRoutes.get("/:item_id/edit", controller.renderEditPage);
itemsRoutes.post("/:item_id/edit", controller.updateFromView);
itemsRoutes.post("/:item_id/delete", controller.deleteFromView);

// ========================
// JSON API ROUTES (DYNAMIC AFTER)
// ========================
itemsRoutes.get("/", controller.listItems);
itemsRoutes.get("/:item_id", idParam, controller.getItemById);
itemsRoutes.post("/", upsertItems, controller.createItem);
itemsRoutes.put("/:item_id", [...idParam, ...upsertItems], controller.updateItem);
itemsRoutes.delete("/:item_id", idParam, controller.deleteItem);
