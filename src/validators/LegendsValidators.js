import { body, param } from "express-validator";

// ✅ For endpoints that include a legend_id (e.g., GET /legends/:legend_id)
export const idParam = [
  param("legend_id")
    .isInt({ gt: 0 })
    .withMessage("id must be an integer"),
];

// ✅ For creating or updating legends
export const upsertLegends = [
  body("name")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Name should be a string between 1–255 characters"),

  body("role")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Role should be a string between 1–255 characters"),

  body("created_at")
    .optional()
    .isISO8601()
    .withMessage("created_at must be a valid ISO date"),
];

// ✅ For creating/updating a legend’s abilities
export const upsertAbilities = [
  body("legend_id")
    .isInt({ gt: 0 })
    .withMessage("legend_id must be a positive integer"),

  body("ability_name")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("ability_name should be a string between 1–255 characters"),

  body("ability_type")
    .isIn(["Passive", "Tactical", "Ultimate"])
    .withMessage("ability_type must be one of: Passive, Tactical, Ultimate"),

  body("description")
    .isString()
    .isLength({ min: 1 })
    .withMessage("description should be a non-empty string"),
];
