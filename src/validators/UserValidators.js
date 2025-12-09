import { body, param } from "express-validator";

// ✅ For routes with user_id in params (GET, PUT, DELETE /users/:user_id)
export const idParam = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("id must be an integer "),
];

// ✅ For POST/PUT routes to create or update users
export const upsertUsers = [
  body("username")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Username should be a string between 1–255 characters"),

  body("email")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("email should be a string between 1–255 characters"),

  body("password")
  .optional({ nullable: true })
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long"),


  body("coins")
    .isInt({ min: 0 })
    .withMessage("Coins must be a non-negative integer"),
];
