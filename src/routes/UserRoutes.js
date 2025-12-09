// src/routes/UserRoutes.js
import { Router } from "express";

import { UserRepository } from "../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";

import { idParam, upsertUsers } from "../validators/UserValidators.js";

export const userRoutes = Router();

// Instantiate core layers
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

/* ============================================================
   ADMIN HTML VIEWS
============================================================ */

// Manage page (list users)
userRoutes.get("/manage", controller.renderManagePage);

// Delete user from HTML form
userRoutes.post("/:user_id/delete", idParam, controller.deleteFromView);


/* ============================================================
   JSON API ROUTES (Admin)
============================================================ */

// JSON list users
userRoutes.get("/", controller.list);

// JSON get single
userRoutes.get("/:user_id", idParam, controller.get);

// ADMIN CREATES USER (HTML FORM)
userRoutes.post("/", upsertUsers, async (req, res) => {
  try {
    await controller.UserService.saveUser(req.body);
    return res.redirect("/api/users/manage");  // ← ADMIN stays in dashboard
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error creating user.");
  }
});

// Update
userRoutes.put("/:user_id", [...idParam, ...upsertUsers], controller.update);

// Delete JSON
userRoutes.delete("/:user_id", idParam, controller.delete);

