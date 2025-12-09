import { body, param } from "express-validator";

// Validate admin_id in URL params
export const idParam = [
  param("admin_id")
    .isInt({ gt: 0 })
    .withMessage("id must be a positive integer"),
];

// Validate body for POST + PUT
export const upsertAdmins = [
  body("username")
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage("Username must be 1–255 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password") 
    .optional({ nullable: true })   
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
