// Import Express framework to build and manage the backend API
import express from "express";

// Import middleware to handle JSON request bodies
import bodyParser from "body-parser";

// Import all route files (each one handles a specific part of the app)
import { abilitiesRoutes } from "./routes/AbilitiesRoutes.js";
import { adminsRoutes } from "./routes/AdminsRoutes.js";
import { itemsRoutes } from "./routes/ItemsRoutes.js";
import { legendsRoutes } from "./routes/LegendsRoutes.js";
import { packRoutes } from "./routes/PackRoutes.js";
import { packRewardRoutes } from "./routes/PackRewardRoutes.js";
import { userItemsRoutes } from "./routes/UserItemsRoutes.js";
import { userPacksRoutes } from "./routes/UserPacksRoutes.js";
import { userRoutes } from "./routes/UserRoutes.js";

// Create an instance of an Express application
const app = express();

// Middleware setup
// This line tells Express to automatically parse incoming JSON requests
app.use(bodyParser.json());

// Register all API routes with prefixes (each route handles specific logic)
app.use("/api/abilities", abilitiesRoutes);       // Routes for legends' abilities
app.use("/api/admins", adminsRoutes);             // Routes for admin operations
app.use("/api/items", itemsRoutes);               // Routes for weapons and items
app.use("/api/legends", legendsRoutes);           // Routes for legends and their details
app.use("/api/packs", packRoutes);                // Routes for packs
app.use("/api/packRewards", packRewardRoutes);    // Routes for pack rewards (what’s inside packs)
app.use("/api/useritems", userItemsRoutes);       // Routes for items owned by users
app.use("/api/userpacks", userPacksRoutes);       // Routes for packs owned/opened by users
app.use("/api/users", userRoutes);                // Routes for user accounts

// Export the app so that server.js can import and start it
export default app;

