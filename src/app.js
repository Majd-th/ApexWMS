// src/app.js
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import methodOverride from "method-override";

// API routes...
import { abilitiesRoutes } from "./routes/AbilitiesRoutes.js";
import { adminsRoutes } from "./routes/AdminsRoutes.js";
import { itemsRoutes } from "./routes/ItemsRoutes.js";
import { legendsRoutes } from "./routes/LegendsRoutes.js";
import { packRoutes } from "./routes/PackRoutes.js";
import { packRewardRoutes } from "./routes/PackRewardRoutes.js";
import { userItemsRoutes } from "./routes/UserItemsRoutes.js";
import { userPacksRoutes } from "./routes/UserPacksRoutes.js";
import { userRoutes } from "./routes/UserRoutes.js";

// UI routes
import userViewRoutes from "./routes/UserViewRoutes.js";
import adminViewRoutes from "./routes/AdminViewRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// ------- SESSION (must be before routes) -------
app.use(
  session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: true,
  })
);


// 🔥 body parsers FIRST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔥 static files
app.use(express.static("public"));

// 🔥 NOW mount admin UI routes
app.use("/admin", adminViewRoutes);

app.use("/user", userViewRoutes);
app.use("/api/admins", adminsRoutes);


// ------- OTHER MIDDLEWARE -------
app.use(methodOverride("_method"));


// ------- API ROUTES -------
app.use("/api/abilities", abilitiesRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/legends", legendsRoutes);
app.use("/api/packs", packRoutes);
app.use("/api/packRewards", packRewardRoutes);
app.use("/api/useritems", userItemsRoutes);
app.use("/api/userpacks", userPacksRoutes);
app.use("/api/users", userRoutes);



// ------- ERROR HANDLER -------
app.use(errorHandler);

export default app;
