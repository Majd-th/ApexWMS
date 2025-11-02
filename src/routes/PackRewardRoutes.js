import { Router } from "express";                               // Express Router import
import { PackRewardRepository } from "../domain/Repositories/PackRewardRepository.js"; // Repository for pack_rewards
import { PackRewardService } from "../service/PackRewardService.js";                   // Service layer
import { PackRewardController } from "../controller/PackRewardController.js";          // Controller
import { packRewardIdParam, upsertPackRewards } from "../validators/PackRewardValidators.js"; // Validators

// Initialize MVC structure
const repo = new PackRewardRepository();
const service = new PackRewardService(repo);
const controller = new PackRewardController(service);

export const packRewardRoutes = Router();                      // Router instance export

// Define endpoints
packRewardRoutes.get("/pack/:pack_id", controller.getRewardsByPack.bind(controller)); // GET all rewards in a pack
packRewardRoutes.post("/", upsertPackRewards, controller.createReward.bind(controller)); // POST add reward
packRewardRoutes.delete("/:pack_reward_id", packRewardIdParam, controller.deleteReward.bind(controller)); // DELETE reward
packRewardRoutes.post("/pack/:pack_id", controller.createRewardForPack.bind(controller));//specific rewards for a pack 
//console.log("✅ <PackRewards>Routes loaded");                   // Debug confirmation log
