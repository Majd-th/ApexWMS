// src/server.js

import { userRoutes } from "./routes/UserRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import the Express app (API + middleware) from app.js
import app from "./app.js";

// Extra Express + layout middleware for views
import express from "express";
import expressLayouts from "express-ejs-layouts";
import e from "express";

// ----- VIEW ENGINE + LAYOUT SETUP -----
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Parse form data from HTML <form> (login, register, etc.)
app.use(express.urlencoded({ extended: true }));

// EJS layouts
app.use(expressLayouts);
app.set("layout", "./layout");

// ----- HOME PAGE -----
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// ----- USER LOGIN -----
// Show user login form
app.get("/login/user", (req, res) => {
  res.render("user-login", { title: "User Login" });
});

// Handle user login submission
app.post("/login/user", (req, res) => {
  const { username, password } = req.body;
  // TODO: validate user credentials
  return res.redirect("/user/home"); // normal player dashboard
});

// ----- USER DASHBOARD (after login) -----
app.get("/user/home", (req, res) => {
  res.render("user-home", { title: "Player Dashboard" });
});
// ----- ADMIN LOGIN -----
// Show admin login form
app.get("/login/admin", (req, res) => {
  res.render("login-admin", { title: "Admin Login" });
});

// Handle admin login submission
app.post("/login/admin", (req, res) => {
  const { username, password } = req.body;
  // TODO: real admin auth here
  // ✅ After login, go to admin dashboard (not directly to manage users)
  return res.redirect("/admin");
});
// ----- ADMIN DASHBOARD -----
app.get("/admin", (req, res) => {
  res.render("admin-home", { title: "Admin Dashboard" });
});

// ----- USER REGISTRATION -----
app.get("/register", (req, res) => {
  res.render("register-user", { title: "User Registration", error: null });
});

// ----- START SERVER -----
const PORT = process.env.PORT || 3000;
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ----- STATIC FILES (for images, css, etc.) -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve everything inside /public as static
app.use(express.static(path.join(__dirname, "..", "public")));