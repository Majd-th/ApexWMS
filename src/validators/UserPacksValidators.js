import { body, param } from "express-validator";

/**
 * ✅ idParam
 * Validates both `user_id` and `pack_id` route parameters.
 * 
 * 🧠 Used in routes where both parameters appear in the URL, for example:
 *   - GET /user-packs/check/:user_id/:pack_id
 *   - DELETE /user-packs/:user_id/:pack_id
 * 
 * Ensures both IDs are integers greater than 0.
 */
export const idParam = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("user_id must be an integer greater than 0"),

  param("pack_id")
    .isInt({ gt: 0 })
    .withMessage("pack_id must be an integer greater than 0"),
];

/**
 * ✅ upsertUserPacks
 * Used for POST or PUT requests to create or update user-pack records.
 * 
 * 🧠 Typical usage:
 *   - POST /user-packs
 *   - PUT /user-packs/:id
 * 
 * Validates:
 *  - `user_id`: must be a positive integer
 *  - `pack_id`: must be a positive integer
 *  - `obtained_at`: must be a valid ISO8601 date string (e.g., "2025-10-11T00:00:00Z")
 * 
 * `.toDate()` converts the date string into a JavaScript Date object automatically.
 */
export const upsertUserPacks = [
  body("user_id")
    .isInt({ gt: 0 })
    .withMessage("user_id must be an integer greater than 0"),

  body("pack_id")
    .isInt({ gt: 0 })
    .withMessage("pack_id must be an integer greater than 0"),

  body("obtained_at")
    .isISO8601()
    .toDate()
    .withMessage(
      "obtained_at must be a valid date (ISO8601 format, e.g. 2025-10-11T00:00:00Z)"
    ),
];

/**
 * ✅ userIdParam
 * Validates only the `user_id` route parameter.
 * 
 * 🧠 Used for routes where only a user’s ID is required, such as:
 *   - GET /user-packs/user/:user_id
 *   - GET /users/:user_id/packs
 * 
 * Ensures the ID is a positive integer.
 */
export const userIdParam = [
  param("user_id")
    .isInt({ gt: 0 })
    .withMessage("user_id must be an integer greater than 0"),
];
