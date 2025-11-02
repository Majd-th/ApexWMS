import { Router } from "express";

// Import repositories
import { PackRepository } from "../domain/Repositories/PackRepository.js";
import { UserRepository } from "../domain/Repositories/UserRepository.js";
import { UserPacksRepository } from "../domain/Repositories/UserPacksRepository.js";
import { UserItemsRepository } from "../domain/Repositories/UserItemsRepository.js";
import { PackRewardRepository } from "../domain/Repositories/PackRewardRepository.js";
import { TransactionsRepository } from "../domain/Repositories/TransactionsRepository.js";

// Import service and controller
import { PackService } from "../service/PackService.js";
import { PackController } from "../controller/PackController.js";

// Import validators
import { idParam, upsertPacks } from "../validators/PackValidators.js";

export const packRoutes = Router();

// ✅ Instantiate all repositories
const packRepo = new PackRepository();
const userRepo = new UserRepository();
const userPacksRepo = new UserPacksRepository();
const userItemsRepo = new UserItemsRepository();
const packRewardsRepo = new PackRewardRepository();
const transactionsRepo = new TransactionsRepository();

// ✅ Inject them into the service
const packService = new PackService(
  packRepo,
  userRepo,
  userPacksRepo,
  userItemsRepo,
  packRewardsRepo,
 transactionsRepo
);

// ✅ Create the controller instance
const packController = new PackController(packService);

// ===================== ROUTES ===================== //

// 📦 CRUD
packRoutes.get("/", packController.listPacks);                                      // GET all packs
packRoutes.get("/:pack_id", idParam, packController.getPackById);                   // GET pack by ID
packRoutes.post("/", upsertPacks, packController.createPack);                       // POST create new pack
packRoutes.put("/:pack_id", [...idParam, ...upsertPacks], packController.updatePack); // PUT update existing pack
packRoutes.delete("/:pack_id", idParam, packController.deletePack);                 // DELETE pack

// 💰 BUY PACK — allows user to purchase using coins
packRoutes.post("/buy/:user_id/:pack_id", packController.buyPack);

// 🎁 OPEN PACK — opens user’s pack and gives random reward
packRoutes.post("/open/:user_id/:pack_id", packController.openPack);

// ================================================== //

//console.log("✅ <Pack>Routes loaded");  // Debug confirmation log

