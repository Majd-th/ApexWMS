import { Router } from "express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { AdminsRepository } from "../domain/repositories/AdminsRepository.js";
import { AdminViewController } from "../controllers/AdminViewController.js";

const router = Router();
const adminRepo = new AdminsRepository();
const controller = new AdminViewController(adminRepo);

// CORRECT ROUTES (do NOT repeat "/admin")
router.get("/login", controller.renderLogin);
router.post("/login", controller.handleLogin);

router.get("/dashboard", requireAdmin, controller.dashboard);
router.get("/logout", requireAdmin, controller.logout);

export default router;
