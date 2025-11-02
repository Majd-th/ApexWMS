# 🧩 ApexWMS (Apex Legends Pack Management System)

## 📖 Overview
ApexWMS is a backend application built using **Node.js** and **Express.js** that simulates an Apex Legends–style inventory and pack management system.  
It allows administrators to create packs, items, and legends, while users can own packs and receive items as rewards.  
The project demonstrates the implementation of a **layered architecture** with full validation, error handling, and SQL-based persistence.

---

## 🧱 Project Architecture

The project follows a **modular MVC (Model–View–Controller)** pattern with a multi-layer structure:

config/
└── db.js # Database connection (PostgreSQL + dotenv)
src/
├── controller/ # Handles HTTP requests and responses
├── domain/
│ ├── entities/ # Data structures representing DB records
│ ├── DTO/ # Data Transfer Objects (for clean API responses)
│ └── Repositories/ # SQL queries and data persistence
├── middleware/ # (optional) auth / custom middleware
├── routes/ # Express routers for each entity
├── service/ # Business logic between controller and repo
├── validators/ # Express-validator rules for all inputs
├── schema/ # Database schema (SQL)
├── app.js # Main Express app configuration
└── server.js # Entry point (nodemon runs this)
.env # Environment configuration

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
2️⃣ Configure Environment Variables

Create a .env file in the root directory:

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=apex_db
PGPORT=5432
PORT=3000

3️⃣ Start Server
npm run dev

Or, if running manually:
node src/server.js


🧩 Technologies Used


Node.js – JavaScript runtime environment


Express.js – Web framework for APIs


Express-Validator – Input validation and sanitization


PostgreSQL (Native SQL) – Relational database for persistence


dotenv – Environment variable management


nodemon – Auto-reload during development



🧾 Database Schema Overview
The database consists of 9 interconnected tables:
TableDescriptionusersStores player info, email, hashed password, and coins.adminsManages admin access (1 default admin).legendsApex characters (name, role, description).abilitiesEach legend’s 3 abilities: Passive, Tactical, Ultimate.itemsWeapons, heirlooms, and equipment.packsLoot boxes users can obtain.pack_rewardsItems or legends available inside packs.user_packsTracks packs owned by each user.user_itemsTracks individual items obtained by each user.
✅ Relationships:


legends → abilities → items (via legend_id)


packs → pack_rewards → items or legends


users → user_packs → user_items



🚀 API Endpoints Summary
All routes are prefixed with /api/.
EntityMethodEndpointDescriptionUsersGET/api/usersList all usersGET/api/users/:idGet user by IDPOST/api/usersCreate new userPUT/api/users/:idUpdate user infoDELETE/api/users/:idDelete userLegendsGET/api/legendsList all legendsPOST/api/legendsCreate new legendItemsGET/api/itemsList all itemsPOST/api/itemsCreate itemGET/api/items/:idGet item by IDPacksGET/api/packsList all packsPOST/api/packsCreate new packPack RewardsGET/api/packRewards/pack/:pack_idGet rewards of a packUser ItemsGET/api/useritems/user/:user_idList user’s itemsUser PacksGET/api/userpacks/user/:user_idList user’s packs
All routes are validated with express-validator, ensuring correct input before database interaction.

🧪 Testing with Postman
1️⃣ Launch the Server
Ensure npm run dev is running and Server running on port 3000 appears in the console.
2️⃣ Open Postman
Import the Postman Collection JSON (included in your workspace).
3️⃣ Test Example
GET http://localhost:3000/api/users
✅ Returns all registered users from the database.
POST http://localhost:3000/api/items
Body (JSON):
{
  "item_name": "Wingman",
  "category": "Weapon",
  "subcategory": "Pistol",
  "legend_id": null,
  "damage": 45,
  "ammo_type": "Heavy",
  "description": "Precision revolver pistol."
}


🧰 Debugging Techniques Used
Throughout development, several console.log() statements were added to trace flow:
Log ExamplePurposeconsole.log("Repo loading...")Confirms repository initialization before the server starts.console.log("Service loading...")Ensures service layer connected properly.console.log("✅ <Users>Routes loaded")Confirms routes were successfully mounted.console.log("Server running on port 3000")Verifies server startup.
These helped isolate issues (such as missing imports or invalid SQL queries) quickly during testing.

⚠️ Error Handling
All exceptions propagate Repository → Service → Controller:


Repository throws DB or validation errors.


Service wraps them with descriptive messages.


Controller catches and returns appropriate HTTP status:


400 → Validation error


404 → Not found


500 → Internal server error





🧾 Validation (Express-Validator)
Every route input is checked before hitting the database.
Example:
body('item_name').isString().isLength({ min: 1, max: 100 })
.withMessage('Item name is required and must be less than 100 characters');


🧩 How to Extend
You can easily add new entities (like user_abilities or match_history) by following the same structure:


Create new Entity, DTO, Repository, Service, and Controller files.


Add a corresponding Route and Validator.


Register the new router in app.js.



📦 Version
v1.0.0 – Final Submission 
Includes:


Complete layered backend architecture


Debugging and validation logs


SQL-based data persistence


Postman workspace for testing


Fully documented and commented source code

