import { body, param } from "express-validator";

// ✅ For routes like /packs/:pack_id
export const idParam = [
  param("pack_id")
    .isInt({ gt: 0 })
    .withMessage("pack_id must be a positive integer"),
];

// ✅ For POST/PUT creating or updating packs
export const upsertPacks = [
  body("pack_name")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("pack_name should be a string between 1–255 characters"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("price must be a positive number"),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("description should be a string up to 500 characters"),
];
