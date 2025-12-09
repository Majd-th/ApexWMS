import { body, param } from "express-validator";

// For routes using /items/:item_id
export const idParam = [
  param("item_id")
    .isInt({ gt: 0 })
    .withMessage("item_id must be a positive integer"),
];

// For adding or updating an item
export const upsertItems = [
  body("item_name")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("item_name should be a string between 1–100 characters"),

  body("category")
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage("category should be a string between 1–50 characters"),

  body("subcategory")
    .optional({ checkFalsy: true })  // FIXED
    .isString()
    .isLength({ max: 50 })
    .withMessage("subcategory must be a string up to 50 characters"),

  body("legend_id")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("legend_id must be a positive integer"),

  body("damage")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("damage must be a non-negative integer"),

  body("ammo_type")
    .optional({ checkFalsy: true })  // FIXED
    .isString()
    .isLength({ max: 50 })
    .withMessage("ammo_type must be a string up to 50 characters"),

  body("description")
    .optional({ checkFalsy: true })  // FIXED
    .isString()
    .isLength({ max: 255 })
    .withMessage("description must be a string up to 255 characters"),
];
