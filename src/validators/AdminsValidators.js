
import { body, param } from "express-validator";

// ✅ For routes that use an admin_id in params (like GET, PUT, DELETE /admins/:admin_id)
export const idParam = [
  param("admin_id")
    .isInt({ gt: 0 })
    .withMessage("id must be an integer "),
];

// ✅ For POST/PUT routes that create or update an admin
export const upsertAdmins = [
    // Username must be a non-empty string (1–255)
    body("username")
        .isString()
        .isLength({ min: 1, max: 255 })
        .withMessage("Username should be a string between 1–255 characters "),

    // Email must be a valid string between 1–255
    body("email")
        .isString()
        .isLength({ min: 1, max: 255 })
        .withMessage("email should be a string between 1–255 characters "),

    // Password hash must be a string (for storing hashed password)
    body("passwordHash")
        .isString()
        .isLength({ min: 1, max: 255 })
        .withMessage("password should be a string between 1–255 characters "),

    // created_at must be a valid ISO date (optional)
    body("created_at")
        .isISO8601()
        .toDate()
        .withMessage("created_at must be a valid date (ISO8601 format, e.g. 2025-10-11T00:00:00Z)"),
];
