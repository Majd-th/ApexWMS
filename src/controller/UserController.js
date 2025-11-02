
// Import validationResult from express-validator — used to validate request parameters and body data
import { validationResult } from "express-validator";

// Controller class responsible for handling HTTP requests related to Users.
// It connects route endpoints to the UserService (business logic layer).
export class UserController {
  constructor(UserService) {
    // Inject UserService which provides the main CRUD and data handling logic
    this.UserService = UserService;
  }

  // 🧩 Helper method for validating requests using express-validator
  _validate(req, res) {
    // Extract any validation errors from the request
    const errors = validationResult(req);

    // If errors exist, respond with 400 (Bad Request) and the error details
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Return null if there are no validation errors
    return null;
  }

  // 🔹 GET /users
  // Retrieves all users from the system
  list = async (req, res, next) => {
    try {
      // Calls the UserService to fetch all users
      res.json(await this.UserService.getUsers());
    } catch (e) {
      // Passes unexpected errors to the Express error-handling middleware
      next(e);
    }
  };


  // 🟢 POST /users
  // Creates a new user record
  create = async (req, res, next) => {
    try {
      // Validate request body (username, email, coins, etc.)
      if (this._validate(req, res)) return;

      // Call UserService to create new user
      const data = await this.UserService.saveUser(req.body);

      // Respond with 201 Created and the new user data
      res.status(201).json(data);
    } catch (e) {
      // Forward internal errors to global middleware
      next(e);
    }
  };

  // 🟡 PUT /users/:user_id
  // Updates an existing user’s data
  update = async (req, res, next) => {
    try {
      // Validate request input
      if (this._validate(req, res)) return;

      // Call service to update the user by ID
      const data = await this.UserService.updateUser(req.params.user_id, req.body);

      // Respond with 200 OK and updated data
      res.status(200).json(data);
    } catch (e) {
      // Handle unexpected errors
      next(e);
    }
  };

  // 🔴 DELETE /users/:user_id
  // Deletes a user record from the system
  delete = async (req, res, next) => {
    try {
      // Validate parameters
      if (this._validate(req, res)) return;

      // Call service to delete the user
      const ok = await this.UserService.deleteUser(req.params.user_id);

      // If not found, send 404 Not Found
      if (!ok) return res.status(404).json({ message: "Not found" });

      // If deleted successfully, respond with 204 (No Content)
      res.status(204).send();
    } catch (e) {
      // Pass errors to middleware for centralized handling
      next(e);
    }
  };
  
  // 🔍 GET /users/:user_id
  // Retrieves a single user by ID
  get = async (req, res, next) => {
    try {
      // Validate route parameters before proceeding
      if (this._validate(req, res)) return;

      // Call UserService to find the user by ID
      const data = await this.UserService.getUserById(req.params.user_id);

      // If user not found, return 404 Not Found
      if (!data) return res.status(404).json({ message: "Not found" });

      // Respond with 200 OK and user data
      res.status(200).json(data);
    } catch (e) {
      // Forward unexpected errors to middleware
      next(e);
    }
  };
}

/*
📝 Notes:
- The controller uses async arrow functions for each route (list, get, create, update, delete).
  This ensures that `this` always refers to the class instance (unlike regular methods that may lose context).
- `_validate()` checks for validation errors using express-validator and prevents the rest of the function from running if input is invalid.
- The controller relies on Express’s built-in `next()` to forward any caught exceptions to a centralized error handler.
*/
