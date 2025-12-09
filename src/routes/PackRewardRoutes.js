// src/routes/PackRewardRoutes.js
import { Router } from "express";

import { PackRewardRepository } from "../domain/repositories/PackRewardRepository.js";
import { PackRewardService } from "../services/PackRewardService.js";
import { PackRewardController } from "../controllers/PackRewardController.js";

import { packRewardIdParam, upsertPackRewards } from "../validators/PackRewardValidators.js";

export const packRewardRoutes = Router();

// Instantiate repo → service → controller
const repo = new PackRewardRepository();
const service = new PackRewardService(repo);
const controller = new PackRewardController(service);
// -----------------------
// ADMIN HTML ROUTES
// -----------------------

packRewardRoutes.get(
  "/manage/:pack_id",
  controller.renderManagePage.bind(controller)
);

packRewardRoutes.post(
  "/manage/:pack_id/create",
  controller.createFromManage.bind(controller)
);

packRewardRoutes.post(
  "/manage/:pack_id/:reward_id/delete",
  controller.deleteFromManage.bind(controller)
);

// -----------------------
// API ROUTES YOU ACTUALLY USE
// -----------------------

packRewardRoutes.get(
  "/pack/:pack_id",
  controller.getRewardsByPack.bind(controller)
);

packRewardRoutes.post(
  "/",
  upsertPackRewards,
  controller.createReward.bind(controller)
);

// ❌ REMOVE update (controller does NOT have this)
// packRewardRoutes.put(
//   "/:pack_reward_id",
//   [...packRewardIdParam, ...upsertPackRewards],
//   controller.updateReward.bind(controller)
// );

// ❌ REMOVE delete (controller may not support this API version)
// packRewardRoutes.delete(
//   "/:pack_reward_id",
//   packRewardIdParam,
//   controller.deleteReward.bind(controller)
// );
