import { Router } from "express";

// Import repositories
import { PackRepository } from "../domain/repositories/PackRepository.js";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserPacksRepository } from "../domain/repositories/UserPacksRepository.js";
import { UserItemsRepository } from "../domain/repositories/UserItemsRepository.js";
import { PackRewardRepository } from "../domain/repositories/PackRewardRepository.js";
import { TransactionsRepository } from "../domain/repositories/TransactionsRepository.js";

// Import service and controller
import { PackService } from "../services/PackService.js";
import { PackController } from "../controllers/PackController.js";

// Import validators
import { idParam, upsertPacks } from "../validators/PackValidators.js";

export const packRoutes = Router();

// Instantiate repositories
const packRepo = new PackRepository();
const userRepo = new UserRepository();
const userPacksRepo = new UserPacksRepository();
const userItemsRepo = new UserItemsRepository();
const packRewardsRepo = new PackRewardRepository();
const transactionsRepo = new TransactionsRepository();

// Inject into service
const packService = new PackService(
  packRepo,
  userRepo,
  userPacksRepo,
  userItemsRepo,
  packRewardsRepo,
  transactionsRepo
);

// Create controller
const packController = new PackController(packService);

// =====================================================
//            ADMIN HTML VIEWS (EJS)
// =====================================================

// 1. Manage page – list packs
packRoutes.get("/manage", packController.renderManagePage);

// 2. Create new pack (EJS form)
packRoutes.post("/manage/create", upsertPacks, packController.createFromView);

// 3. Edit page (form load)
packRoutes.get("/:pack_id/edit", idParam, packController.renderEditPage);

// 4. Update (EJS form submit)
packRoutes.post(
  "/:pack_id/edit",
  [...idParam, ...upsertPacks],
  packController.updateFromView
);

// 5. Delete pack (EJS button)
packRoutes.post("/:pack_id/delete", idParam, packController.deleteFromView);

// =====================================================
//                 JSON API (CRUD)
// =====================================================

packRoutes.get("/", packController.listPacks);
packRoutes.get("/:pack_id", idParam, packController.getPackById);
packRoutes.post("/", upsertPacks, packController.createPack);
packRoutes.put("/:pack_id", [...idParam, ...upsertPacks], packController.updatePack);
packRoutes.delete("/:pack_id", idParam, packController.deletePack);

// =====================================================
//              USER ACTIONS (Buy / Open)
// =====================================================

packRoutes.post("/buy/:user_id/:pack_id", packController.buyPack);
packRoutes.post("/open/:user_id/:pack_id", packController.openPack);
