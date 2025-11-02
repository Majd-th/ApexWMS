import { Router } from "express";                               // Express Router import
import { ItemsRepository } from "../domain/Repositories/ItemsRepository.js";   // DB access
import { ItemsService } from "../service/ItemsService.js";                     // Logic layer
import { ItemsController } from "../controller/ItemsController.js";            // HTTP layer
import { idParam, upsertItems } from "../validators/ItemsValidators.js";       // Validation

export const itemsRoutes = Router();                            // Router for /api/items

const repo = new ItemsRepository();                             // Repository instance
const service = new ItemsService(repo);                         // Service connects logic
const controller = new ItemsController(service);                 // Controller handles API

// Define endpoints
itemsRoutes.get("/", controller.listItems.bind(controller));     // GET all items
itemsRoutes.get("/:item_id", idParam, controller.getItemById.bind(controller)); // GET one item by ID
itemsRoutes.post("/", upsertItems, controller.createItem.bind(controller));     // POST add item
itemsRoutes.put("/:item_id", [...idParam, ...upsertItems], controller.updateItem.bind(controller)); // PUT update item
itemsRoutes.delete("/:item_id", idParam, controller.deleteItem.bind(controller)); // DELETE item

//console.log("✅ <Items>Routes loaded");                          // Confirms routes are registered
