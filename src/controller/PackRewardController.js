// Import validationResult from express-validator — used to collect validation results from route middleware
import { validationResult } from "express-validator";

// Controller that handles all HTTP requests related to Pack Rewards (rewards inside loot packs).
// Connects Express routes to the PackRewardService which contains the business logic.
export class PackRewardController {
  constructor(PackRewardService) {
    // Inject PackRewardService (handles all database interactions and logic)
    this.PackRewardService = PackRewardService;
  }

  // 🧩 Private helper method for validating request input
  _validate(req, res) {
    // Run express-validator checks on the request
    const errors = validationResult(req);

    // If validation errors exist
    if (!errors.isEmpty()) {
      // Send 400 (Bad Request) with details of what failed validation
      res.status(400).json({ errors: errors.array() });
      // Return true to indicate validation failed
      return true;
    }
    // Return false if validation passed successfully
    return false;
  }

  // 🔹 GET /packs/:pack_id/rewards
  // Fetches all rewards that belong to a specific pack
  async getRewardsByPack(req, res, next) {
    try {
      // Run input validation — if it fails, stop execution
      if (this._validate(req, res)) return;

      // Call service to get all rewards for a given pack ID
      const rewards = await this.PackRewardService.getRewardsByPack(req.params.pack_id);

      // Respond with 200 OK and list of rewards
      res.status(200).json(rewards);
    } catch (error) {
      // Pass errors to Express error handler middleware
      next(error);
    }
  }

  // 🟢 POST /packs/rewards
  // Creates a new reward and links it to a pack
  async createReward(req, res, next) {
    try {
      // Validate request body input (using _validate helper)
      if (this._validate(req, res)) return;

      // Call service to create a new reward based on request data
      const reward = await this.PackRewardService.createReward(req.body);

      // Respond with 201 Created and return the created reward
      res.status(201).json(reward);
    } catch (error) {
      // Pass unexpected errors to global error handler
      next(error);
    }
  }
  async createRewardForPack(req, res) {
  try {
    const { pack_id } = req.params;
    const { item_id, legend_id, drop_rate } = req.body;

    // Validate input
    if (!item_id && !legend_id) {
      return res.status(400).json({ error: "Either item_id or legend_id must be provided." });
    }

    const result = await this.PackRewardService.createReward({
      pack_id: parseInt(pack_id),
      item_id,
      legend_id,
      drop_rate,
    });

    res.status(201).json(result);
  } catch (e) {
    console.error("🔥 Error creating reward for pack:", e);
    res.status(500).json({ error: "Failed to create reward for pack." });
  }
}


  // 🔴 DELETE /packs/rewards/:pack_reward_id
  // Deletes a specific reward by its unique ID
  async deleteReward(req, res, next) {
    try {
      // Validate request input (route parameter)
      if (this._validate(req, res)) return;

      // Call service to delete the reward from the database
      const ok = await this.PackRewardService.deleteReward(req.params.pack_reward_id);

      // If not found, respond with 404 Not Found
      if (!ok) return res.status(404).json({ message: "Not found" });

      // If successful, respond with 200 OK and confirmation message
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      // Forward the error to Express middleware
      next(error);
    }
  }
}
