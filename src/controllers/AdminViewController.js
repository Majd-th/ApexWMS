import bcrypt from "bcryptjs";

export class AdminViewController {
  constructor(adminRepo) {
    this.adminRepo = adminRepo;

    // Bind methods
    this.renderLogin = this.renderLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.dashboard = this.dashboard.bind(this);
  }

  // ================================
  // RENDER LOGIN PAGE
  // ================================
  renderLogin(req, res) {
    res.render("login-admin", { error: null });
  }

  // ================================
  // HANDLE LOGIN
  // ================================
async handleLogin(req, res) {
  const { username, password } = req.body;

  try {
    const admin = await this.adminRepo.findByUsername(username);

    if (!admin) {
      return res.render("login-admin", { error: "Invalid username or password" });
    }

    const stored = admin.password_hash;

    if (!stored || !stored.startsWith("$2")) {
      return res.render("login-admin", { error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, stored);

    if (!isMatch) {
      return res.render("login-admin", { error: "Invalid username or password" });
    }

    req.session.admin = {
      id: admin.admin_id,
      username: admin.username
    };

    return res.redirect("/admin/dashboard");

  } catch (err) {
    console.error(err);
    return res.render("login-admin", { error: "Something went wrong" });
  }
}

  // ================================
  // LOGOUT
  // ================================
  logout(req, res) {
  
    req.session.destroy(() => res.redirect("/admin/login"));

  }

  // ================================
  // DASHBOARD PAGE
  // ================================
  dashboard(req, res) {
    res.render("admin-home");
  }
}
