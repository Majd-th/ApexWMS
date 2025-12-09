import { validationResult } from "express-validator";

export class UserItemsController {
  constructor(UserItemsService) {
    this.UserItemsService = UserItemsService;

    // Bind all methods
    this.list = this.list.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.create = this.create.bind(this);
    this.checkOwnership = this.checkOwnership.bind(this);
  }

  // -------------------------
  // HELPERS
  // -------------------------
  _validate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return true;
    }
    return false;
  }

  // -------------------------
  // API METHODS
  // -------------------------

  // GET ALL USER-ITEM RECORDS
  async list(req, res, next) {
    try {
      const result = await this.UserItemsService.getUserItems();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // GET items for a specific user
  async getByUserId(req, res, next) {
    try {
      if (this._validate(req, res)) return;

      const userId = req.params.user_id;
      const data = await this.UserItemsService.getUserItemsByUserId(userId);

      if (!data) {
        return res.status(404).json({ message: "User has no items" });
      }

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  // CREATE a new user-item relation
  async create(req, res, next) {
    try {
      if (this._validate(req, res)) return;

      const { user_id, item_id, acquired_at } = req.body;

      const data = await this.UserItemsService.addItemToUser(
        user_id,
        item_id,
        acquired_at
      );

      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }

  // CHECK if user owns an item
  async checkOwnership(req, res, next) {
    try {
      if (this._validate(req, res)) return;

      const { user_id, item_id } = req.params;

      const owns = await this.UserItemsService.checkUserOwnsItem(user_id, item_id);

      res.status(200).json({ ownsItem: owns });
    } catch (e) {
      next(e);
    }
  }
}
