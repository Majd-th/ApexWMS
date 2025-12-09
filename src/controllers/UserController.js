// Import validationResult from express-validator — used to detect invalid request input
import { validationResult } from "express-validator";

/**
 * Controller responsible for handling all API endpoints and
 * admin-panel views related to USERS.
 *
 * This includes:
 *  - Listing all users
 *  - Fetching a single user
 *  - Creating new users
 *  - Updating user information
 *  - Deleting a user
 *  - Rendering administrative user-management pages (EJS)
 *
 * It delegates all data-handling operations to UserService.
 */
export class UserController {
  constructor(UserService) {
    // Inject service layer dependency
    this.UserService = UserService;

    // Bind API methods to preserve `this` context
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);

    // Bind admin-view handlers
    this.renderManagePage = this.renderManagePage.bind(this);
    this.deleteFromView = this.deleteFromView.bind(this);
  }

  // ============================================================
  //  VALIDATION HELPER
  // ============================================================

  /**
   * Runs express-validator checks and returns:
   *  - false  → validation FAILED (response is already sent)
   *  - true   → validation PASSED
   */
  _validate(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return false; // stop execution
    }
    return true;
  }

  // ============================================================
  // API CONTROLLERS — JSON RESPONSES
  // ============================================================

  /**
   * GET /api/users
   * Returns a list of all users.
   */
  async list(req, res, next) {
    try {
      const users = await this.UserService.getUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  /**
   * GET /api/users/:user_id
   * Returns a single user by ID.
   */
  async get(req, res, next) {
    try {
      // Validate request first
      if (!this._validate(req, res)) return;

      const user = await this.UserService.getUserById(req.params.user_id);

      if (!user)
        return res.status(404).json({ message: "Not found" });

      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  /**
   * POST /api/users
   * Creates a new user in the system.
   */
  async create(req, res) {
    try {
      const dto = await this.UserService.saveUser(req.body);
      return res.status(201).json(dto);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * PUT /api/users/:user_id
   * Updates the data of an existing user.
   */
  async update(req, res, next) {
    try {
      if (!this._validate(req, res)) return;

      const user = await this.UserService.updateUser(req.params.user_id, req.body);

      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  /**
   * DELETE /api/users/:user_id
   * Deletes a specific user.
   */
  async delete(req, res, next) {
    try {
      if (!this._validate(req, res)) return;

      const ok = await this.UserService.deleteUser(req.params.user_id);

      if (!ok)
        return res.status(404).json({ message: "Not found" });

      // 204 → Successfully deleted, no content returned
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  // ============================================================
  //  ADMIN PANEL — EJS VIEWS
  // ============================================================

  /**
   * GET /api/users/manage
   * Renders a page listing all users for admin use.
   */
  async renderManagePage(req, res, next) {
    try {
      const users = await this.UserService.getUsers();
      res.render("users/manage", { users });
    } catch (e) {
      next(e);
    }
  }

  /**
   * POST /api/users/:user_id/delete
   * Deletes a user through the admin HTML interface.
   */
  async deleteFromView(req, res, next) {
    try {
      await this.UserService.deleteUser(req.params.user_id);
      res.redirect("/api/users/manage");
    } catch (e) {
      next(e);
    }
  }
}
