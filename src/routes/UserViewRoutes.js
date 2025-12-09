import { Router } from "express";
import { requireLogin } from "../middlewares/auth.js";

import { UserViewController } from "../controllers/UserViewController.js";
import { UserRepository } from "../domain/repositories/UserRepository.js";
import { LegendsRepository } from "../domain/repositories/LegendsRepository.js";
import { ItemsRepository } from "../domain/repositories/ItemsRepository.js";
import { PackRepository } from "../domain/repositories/PackRepository.js";
import { PackRewardRepository } from "../domain/repositories/PackRewardRepository.js";
import { UserItemsRepository } from "../domain/repositories/UserItemsRepository.js";
import { UserPacksRepository } from "../domain/repositories/UserPacksRepository.js";
import { TransactionsRepository } from "../domain/repositories/TransactionsRepository.js";

import { UserService } from "../services/UserService.js";
import { PackService } from "../services/PackService.js";

// REPOSITORIES
const userRepo = new UserRepository();
const legendsRepo = new LegendsRepository();
const itemsRepo = new ItemsRepository();
const packRepo = new PackRepository();
const packRewardsRepo = new PackRewardRepository();
const userItemsRepo = new UserItemsRepository();
const userPacksRepo = new UserPacksRepository();
const transactionsRepo = new TransactionsRepository();

// SERVICES
const userService = new UserService(userRepo);

const packService = new PackService(
  packRepo,
  userRepo,
  userPacksRepo,
  userItemsRepo,
  packRewardsRepo,
  transactionsRepo
);

// CONTROLLER
const controller = new UserViewController(
  userRepo,
  legendsRepo,
  itemsRepo,
  userItemsRepo,
  packRepo,
  packRewardsRepo,
  userPacksRepo,
  transactionsRepo,
  packService,
  userService // <-- injected correctly
);

const router = Router();

/* ============================================
   LOGIN / LOGOUT
============================================ */
router.get("/login", controller.renderLogin);
router.post("/login", controller.handleLogin);
router.get("/logout", controller.logout);

/* ============================================
   USER REGISTRATION
============================================ */
router.get("/register", (req, res) => {
  res.render("register-user", { error: null });
});

router.post("/register", async (req, res) => {
  try {
    await controller.UserService.saveUser(req.body);
    return res.redirect("/user/login");
  } catch (err) {
    return res.render("register-user", { error: err.message });
  }
});

/* ============================================
   USER HOME
============================================ */
router.get("/home", requireLogin, controller.renderHome);

/* ============================================
   LEGENDS / ITEMS
============================================ */
router.get("/legends", requireLogin, controller.getLegends);
router.get("/legends/:id", requireLogin, controller.getLegendDetails);

router.get("/items", requireLogin, controller.getItems);
router.get("/items/:id", requireLogin, controller.getItemDetails);

/* ============================================
   PACK STORE / BUY / OPEN
============================================ */
router.get("/packs/store", requireLogin, controller.getPackStore);
router.post("/packs/buy/:pack_id", requireLogin, controller.buyPack);

router.get("/packs", requireLogin, controller.getUserPacks);
router.post("/packs/open/:id", requireLogin, controller.openPack);

export default router;
