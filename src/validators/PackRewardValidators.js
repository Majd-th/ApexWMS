import { body, param } from "express-validator";

// ✅ For creating or updating rewards inside a pack
export const upsertPackRewards = [
  body("pack_id")
    .isInt({ gt: 0 })
    .withMessage("pack_id must be a positive integer"),

  body("reward_type")
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("reward_type should be a string between 1–100 characters"),

  body("reward_value")
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("reward_value should be a string between 1–255 characters"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("quantity must be a positive integer")
];

// ✅ For routes that specify a specific reward by ID (like DELETE /pack-rewards/:pack_reward_id)
export const packRewardIdParam = [
  param("pack_reward_id")
    .isInt({ gt: 0 })
    .withMessage("pack_reward_id must be an integer")
];
