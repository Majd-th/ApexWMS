
import { body, param } from "express-validator";

// ✅ Used for routes that include a legend ID parameter in the URL
export const idParam = [
    // Checks that "legend_id" exists in params, is an integer, and greater than 0
    param("legend_id")
        .isInt({ gt: 0 })
        .withMessage("id must be an integer "),
];

// ✅ Used for creating or updating an ability (ability_name, ability_type, description)
export const upsertAbilities = [
    // Checks that ability_name is a string between 1–255 characters
    body("ability_name")
        .isString()
        .isLength({ min: 1, max: 255 })
        .withMessage("Ability name should be a string between 1–255 characters "),

    // Checks that ability_type is a string between 1–255 characters
    body("ability_type")
        .isString()
        .isLength({ min: 1, max: 255 })
        .withMessage("Ability type should be a string between 1–255 characters "),

    // Ensures description is a valid string
    body("description")
        .isString()
        .withMessage("Description must be a string"),
];
