ApexWMS — Apex Legends Pack Management System
Overview

ApexWMS is a full-stack web application built with Node.js, Express.js, EJS, and PostgreSQL.
It simulates an Apex Legends–inspired system where:

Administrators manage packs, items, legends, and users

Players can register, log in, buy packs, open packs, and view earned items

The project demonstrates layered backend architecture, frontend templating, secure authentication, SQL persistence, validation, and clean error-handling patterns.

config/
└── db.js                 # PostgreSQL connection

src/
├── controllers/           # Controllers (request handling)
├── domain/
│   ├── entities/         # Database entities
│   ├── dto/              # Data Transfer Objects
│   └── repositories/     # SQL queries and persistence
├── middleware/           # Authentication and custom middleware
├── routes/               # Express routers (API + Views)
├── services/              # Business logic layer
├── validators/           # Input validation rules
├── views/                # EJS templates (Admin + User UI)
├── schema/               # SQL schema
├── app.js                # Express app configuration
└── server.js             # Application entry point

.env                      # Environment variables
public
|-----img                    # for imgs used 

This architecture ensures separation of concerns:

Controllers handle HTTP requests

Services perform logic

Repositories interact with the database

DTOs ensure clean API responses

EJS views handle the frontend presentation

Frontend (EJS) Overview

ApexWMS includes a full frontend built with EJS, styled pages, and complete admin/user UI flows.

Admin Frontend Pages

Admins access a dashboard where they can:

Manage users

Manage items

Manage legends and abilities

Manage packs

Manage pack rewards (drop rates, items, legends)

Each page uses:

Reusable EJS components

Styled tables

Admin buttons for CRUD operations

Forms with validation

Navigation structure

User Frontend Pages

Users have a fully functional interface:

Login & registration pages

Player dashboard (home)

Legends viewer (all legends and details)

Items viewer

Pack store (buy packs)

User pack inventory

Pack opening animation/result page
        
Setup Instructions
1. Install dependencies
npm install

2. Create a .env file
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=apex_db
PGPORT=5432
PORT=3000

3. Start the server
npm run dev


or

node src/server.js

Technologies Used

Node.js

Express.js

EJS (frontend templating)

PostgreSQL

Express-Validator

bcrypt (password hashing)

dotenv

nodemon
Database Schema Overview

ApexWMS uses 9 tables:
| Table        | Purpose                               |
| ------------ | ------------------------------------- |
| users        | Player accounts, coins, password hash |
| admins       | Admin access                          |
| legends      | Apex Legends characters               |
| abilities    | Passive, tactical, ultimate abilities |
| items        | Weapons, heirlooms, cosmetics         |
| packs        | Buyable loot boxes                    |
| pack_rewards | Reward pool for each pack             |
| user_packs   | Packs owned by each user              |
| user_items   | Items earned by users                 |

Relationships

legends → abilities

packs → pack_rewards → items/legends

users → user_packs → user_items

API Endpoints Summary (Backend)

(All prefixed with /api/)

Users
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

Legends
GET  /api/legends
POST /api/legends

Items
GET  /api/items
POST /api/items
GET  /api/items/:id

Packs
GET  /api/packs
POST /api/packs

Pack Rewards
GET  /api/packRewards/pack/:pack_id
POST /api/packRewards

Admin & User View Routes (Frontend)
Admin pages include:
/api/users/manage
/api/items/manage
/api/legends/manage
/api/packs/manage
/api/packRewards/manage/:pack_id

User pages include:
/user/login
/user/register
/user/home
/user/legends
/user/items
/user/packs/store
/user/packs

Testing With Postman

Start the server

Open Postman

Try:

GET http://localhost:3000/api/users


Example POST:

POST http://localhost:3000/api/items
{
  "item_name": "Wingman",
  "category": "Weapon",
  "subcategory": "Pistol",
  "legend_id": null,
  "damage": 45,
  "ammo_type": "Heavy",
  "description": "Precision revolver pistol."
}

Error Handling

Errors are managed consistently:

Repository throws SQL or data errors

Service layer translates them

Controller returns an appropriate HTTP response

Status Codes:

400: Validation errors

404: Resource not found

500: Server error

User-facing EJS pages also display friendly messages.

Validation (express-validator)

Every API endpoint enforces strict validation:

body("item_name")
  .isString()
  .isLength({ min: 1, max: 100 })


This ensures safe and predictable database operations.

Extending the System

To add new features:

Create Entity

Create Repository

Create Service

Create Controller

Add Routes

Add Validators

Create EJS pages (if needed)

Register router in app.js

The modular architecture makes expansion straightforward.