import { body, param } from "express-validator";

// ✅ Validates that the `user_id` parameter exists and is a positive integer.
// Used in routes like: GET /user-items/:user_id, POST /user-items
export const userIdParam = [
    param("user_id")
        .isInt({ gt: 0 })
        .withMessage("user_id must be an integer "),
];

// ✅ Validates that the `pack_id` parameter exists and is a positive integer.
// ⚠️ In the case of user items, this might actually refer to `item_id` instead of `pack_id`,
// depending on how your routes are structured (e.g. GET /users/:user_id/items/:item_id).
// If so, rename this to `itemIdParam` for clarity.
export const packIdParam = [
    param("pack_id")
        .isInt({ gt: 0 })
        .withMessage("pack_id must be an integer "),
];

// ✅ Validates the `acquired_at` field in the request body.
// Ensures that the date format follows ISO 8601 (e.g. "2025-10-31T15:30:00Z").
// Used when creating or updating user-item records.
export const obtainPackBody = [
    body("acquired_at")
        .isISO8601()
        .withMessage("obtained_at must be a valid date"),
];

// ✅ Validates that `user_pack_id` (the primary key for the user-item or user-pack relationship)
// is a valid integer greater than 0.
// Used for operations like DELETE /user-items/:user_item_id
export const userPackIdParam = [
    param("user_pack_id")
        .isInt({ gt: 0 })
        .withMessage("user_pack_id must be an integer "),
];

// ✅ Combines user_id and pack_id (or item_id) validators.
// Used in routes that include both parameters, e.g. GET /users/:user_id/items/:item_id
export const userPackParams = [
    ...userIdParam,
    ...packIdParam,
];

// ✅ Combines both parameter validation and body validation.
// Used when both IDs and request body fields (like `acquired_at`) are required.
// Example: POST /users/:user_id/items/:item_id with { "acquired_at": "2025-10-31T00:00:00Z" }
export const userPackParamsWithBody = [
    ...userPackParams,
    ...obtainPackBody,
];

// ✅ Validates the unique record ID (`user_pack_id`) along with the body data.
// Used for updating a specific user-item record by ID.
export const userPackIdWithBody = [
    ...userPackIdParam,
    ...obtainPackBody,
];
