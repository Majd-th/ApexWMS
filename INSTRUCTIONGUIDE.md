Instructor Usage Guide

This guide explains how to use and evaluate the ApexWMS system from both the User side and the Admin side. It provides step-by-step instructions to navigate all features.
first run npm run dev in terminal and in ur browser localhost:3000
1. How to Use the System as a User
Step 1 — Create a User Account

Open the application in your browser.

Navigate to:

/user/register


Fill in the registration form (username, email, password, starting coins).

Submit the form.

Step 2 — Login as the New User

Go to:

/user/login


Enter your username and password.

Step 3 — Explore Your Dashboard

After logging in, you will land on the User Home page.
From the navigation menu you can access:

Legends

View all legends in the system

Click on any legend to see its detailed description and abilities

Items

View all available items in the game

You can also see which items you personally own

Step 4 — Visit the Pack Store

Go to:

/user/packs/store


Here you can:

View all available packs

See their price and image

Buy a pack using your balance

Your coins automatically update after purchasing.

Step 5 — Open Your Packs

Go to:

/user/packs


This page shows:

All packs currently owned

An "Open" button for each pack

When you open a pack:

A random item is selected based on drop rate

That item is added to your inventory

A result page appears showing the reward

You can return to the Items page to see all owned items.

2. How to Use the System as an Admin
Important Note

You cannot create an admin from the UI.
To create a new admin, you must use Postman or SQL.

However, one default admin account is provided:

Username: admin_apex12
Password: apex123

Step 1 — Login as Admin

Open:

/admin/login


Enter the credentials above.

Step 2 — Access the Admin Dashboard

The Admin Dashboard allows full control over all system data.
You can manage everything from A to Z.

Manage Users

Navigate to:

/api/users/manage


You can:

View all users

Create a new user

Edit user details

View user coins and registration date

Manage Items

Navigate to:

/api/items/manage


You can:

View all items

Create a new item

Edit item details

Delete items

Manage Legends

Navigate to:

/api/legends/manage


You can:

Create a new legend

Edit legend info

Delete a legend

Add or edit abilities (Passive, Tactical, Ultimate)

Manage Packs

Navigate to:

/api/packs/manage


You can:

Create a pack (pack name, price, description, etc.)

Edit a pack

Delete a pack

Manage Pack Rewards

After creating a pack, click "Manage Rewards".

You can:

Add rewards to the pack

Choose item or legend rewards

Set drop rates

Delete specific rewards

This system lets you fully customize how each pack behaves.