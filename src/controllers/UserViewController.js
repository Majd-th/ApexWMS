// Import bcrypt for password hashing & verification
import bcrypt from "bcryptjs";

/**
 * Controller responsible for all USER-FACING web pages (EJS views)
 * and user-specific operations such as login, viewing items, opening packs, etc.
 *
 * This controller interacts with multiple repositories and services:
 *  - userRepo: fetches user accounts
 *  - legendsRepo: retrieves legend data
 *  - itemsRepo: retrieves item data
 *  - userItemsRepo: fetches items owned by specific users
 *  - packRepo: retrieves all purchasable packs
 *  - packRewardsRepo: retrieves reward pools inside packs
 *  - userPacksRepo: fetches packs owned by users
 *  - transactionsRepo: logs purchases / operations
 *  - packService: handles buying/opening pack logic
 *  - UserService: provides user-related logic
 */
export class UserViewController {
  constructor(
    userRepo,
    legendsRepo,
    itemsRepo,
    userItemsRepo,
    packRepo,
    packRewardsRepo,
    userPacksRepo,
    transactionsRepo,
    packService,
    userService
  ) {
    // Store all repositories and services
    this.userRepo = userRepo;
    this.legendsRepo = legendsRepo;
    this.itemsRepo = itemsRepo;
    this.userItemsRepo = userItemsRepo;
    this.packRepo = packRepo;
    this.packRewardsRepo = packRewardsRepo;
    this.userPacksRepo = userPacksRepo;
    this.transactionsRepo = transactionsRepo;

    this.packService = packService;
    this.UserService = userService;

    // Bind all controller methods to ensure 'this' is preserved
    this.renderLogin = this.renderLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.renderHome = this.renderHome.bind(this);
    this.getLegends = this.getLegends.bind(this);
    this.getLegendDetails = this.getLegendDetails.bind(this);
    this.getItems = this.getItems.bind(this);
    this.getItemDetails = this.getItemDetails.bind(this);
    this.getPackStore = this.getPackStore.bind(this);
    this.buyPack = this.buyPack.bind(this);
    this.getUserPacks = this.getUserPacks.bind(this);
    this.openPack = this.openPack.bind(this);

    // Mapping pack names → image filenames for EJS pages
    this.PACK_IMAGES = {
      "Heirloom Pack": "pack1png.png",
      "Legendary Pack": "lpack.png",
      "Premium Pack": "pack.png"
    };
  }

  /**
   * Utility helper that converts an item or reward name
   * to a matching filename by sanitizing the string.
   */
  imageFileFromName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") + ".png";
  }

  // ============================================================
  // USER LOGIN & LOGOUT
  // ============================================================

  /**
   * GET /user/login
   * Renders the user login page (EJS).
   */
  renderLogin(req, res) {
    res.render("user-login", { error: null });
  }

  /**
   * POST /user/login
   * Verifies username + password and creates a session.
   * Supports both plain-text (old accounts) and bcrypt hashed passwords.
   */
  async handleLogin(req, res) {
    const { username, password } = req.body;

    try {
      // Look up user by username
      const user = await this.userRepo.findByUsername(username);
      if (!user) {
        return res.render("user-login", { error: "Invalid username or password" });
      }

      // Handle existing hashing or legacy plaintext
      const stored = user.password_hash || user.password;
      let valid = false;

      if (stored.startsWith("$2b$")) {
        // Normal bcrypt password comparison
        valid = await bcrypt.compare(password, stored);
      } else if (stored === password) {
        // Legacy plaintext → convert to hashed password
        valid = true;
        const newHash = await bcrypt.hash(password, 10);
        await this.userRepo.updatePassword(user.user_id, newHash);
      }

      if (!valid) {
        return res.render("user-login", { error: "Invalid username or password" });
      }

      // Store basic session data
      req.session.user = {
        id: user.user_id,
        username: user.username,
        coins: user.coins
      };

      res.redirect("/user/home");
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      res.render("user-login", { error: "Something went wrong." });
    }
  }

  /**
   * GET /user/logout
   * Destroys session & redirects to login.
   */
  logout(req, res) {
    req.session.destroy(() => res.redirect("/user/login"));
  }

  // ============================================================
  // USER HOME
  // ============================================================

  /**
   * GET /user/home
   * Main user dashboard.
   */
  renderHome(req, res) {
    res.render("user-home", { title: "Player Dashboard" });
  }

  // ============================================================
  // LEGENDS (EJS VIEWS)
  // ============================================================

  /**
   * GET /user/legends
   * Retrieves all legends and displays them.
   */
  async getLegends(req, res) {
    const legends = await this.legendsRepo.findAll();
    res.render("user-legends", {
      legends,
      selectedLegend: null
    });
  }

  /**
   * GET /user/legends/:id
   * Shows one selected legend with full details.
   */
  async getLegendDetails(req, res) {
    const legends = await this.legendsRepo.findAll();
    const selectedLegend = await this.legendsRepo.findById(req.params.id);

    res.render("user-legends", {
      legends,
      selectedLegend
    });
  }

  // ============================================================
  // ITEMS VIEW
  // ============================================================

  /**
   * GET /user/items
   * Displays all items in the system + items owned by user.
   */
  async getItems(req, res) {
    const userId = req.session.user.id;

    const allItems = await this.itemsRepo.findAll();
    const owned = await this.userItemsRepo.findByUserId(userId);

    res.render("user-items", {
      allItems: allItems.map(i => ({
        ...i,
        imageFile: this.imageFileFromName(i.item_name)
      })),
      userOwned: owned
    });
  }

  /**
   * GET /user/items/:id
   * Displays full item details + matching image.
   */
  async getItemDetails(req, res) {
    const item = await this.itemsRepo.findById(req.params.id);

    res.render("user-item-details", {
      item,
      imageFile: this.imageFileFromName(item.item_name)
    });
  }

  // ============================================================
  // PACK STORE (BUYING PACKS)
  // ============================================================

  /**
   * GET /user/packs
   * Displays the store where user can buy packs.
   */
  async getPackStore(req, res) {
    const packs = await this.packRepo.findAll();

    res.render("pack-store", {
      packs: packs.map(p => ({
        ...p,
        imageFile: this.PACK_IMAGES[p.pack_name]
      })),
      user: req.session.user,
      success: null,
      error: null
    });
  }

  /**
   * POST /user/packs/buy/:pack_id
   * Handles pack purchase including balance deduction.
   */
  async buyPack(req, res) {
    const userId = req.session.user.id;
    const packId = req.params.pack_id;

    try {
      const pack = await this.packRepo.findById(packId);

      await this.packService.buyPack(userId, packId);

      // Refresh user balance after purchase
      req.session.user.coins = (await this.userRepo.findById(userId)).coins;

      const packs = await this.packRepo.findAll();

      res.render("pack-store", {
        packs: packs.map(p => ({
          ...p,
          imageFile: this.PACK_IMAGES[p.pack_name]
        })),
        user: req.session.user,
        success: `🎉 You bought "${pack.pack_name}"!`,
        error: null
      });
    } catch (err) {
      const packs = await this.packRepo.findAll();

      res.render("pack-store", {
        packs: packs.map(p => ({
          ...p,
          imageFile: this.PACK_IMAGES[p.pack_name]
        })),
        user: req.session.user,
        success: null,
        error: err.message
      });
    }
  }

  // ============================================================
  // USER PACKS (OWNED PACKS + OPENING THEM)
  // ============================================================

  /**
   * GET /user/my-packs
   * Shows all packs owned by the user.
   */
  async getUserPacks(req, res) {
    const userId = req.session.user.id;

    const packs = await this.userPacksRepo.findByUserId(userId);

    res.render("user-packs", {
      user: req.session.user,
      packs: packs.map(p => ({
        ...p,
        imageFile: this.PACK_IMAGES[p.pack_name] || "default.png"
      }))
    });
  }

  /**
   * POST /user/packs/open/:id
   * Opens one pack owned by the user and reveals the reward.
   */
  async openPack(req, res) {
    try {
      const userId = req.session.user.id;
      const userPackId = req.params.id;

      const result = await this.packService.openPack(userId, userPackId);
      const item = await this.itemsRepo.findById(result.reward.item_id);

      res.render("open-pack-result", {
        reward: {
          item_id: item.item_id,
          item_name: item.item_name,
          imageFile: this.imageFileFromName(item.item_name)
        }
      });
    } catch (err) {
      console.error("OPEN PACK ERROR:", err);
      res.status(500).send(
        "Error opening pack. You already own all items from this pack — but your coins are safe. New items coming soon!"
      );
    }
  }
}
