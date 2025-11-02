-- ========================================
-- 01_create_tables.sql
-- ApexWMS database tables
-- ========================================

-- ========================
-- 1. Users table
-- ========================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    coins INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. Admins table
-- ========================
CREATE TABLE IF NOT EXISTS admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 3. Legends table
-- ========================
CREATE TABLE IF NOT EXISTS legends (
    legend_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50),
    description TEXT
);

-- ========================
-- 4. Abilities table
-- ========================
CREATE TABLE IF NOT EXISTS abilities (
    ability_id SERIAL PRIMARY KEY,
    legend_id INT NOT NULL REFERENCES legends(legend_id) ON DELETE CASCADE,
    ability_name VARCHAR(100) NOT NULL,
    ability_type VARCHAR(50) NOT NULL, -- passive, tactical, ultimate
    description TEXT
);

-- ========================
-- 5. Items table (Weapons & Heirlooms)
-- ========================
CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,   -- Weapon / Heirloom
    subcategory VARCHAR(50),
    legend_id INT REFERENCES legends(legend_id) ON DELETE SET NULL,
    damage INT,
    ammo_type VARCHAR(50),
    description TEXT
);

-- ========================
-- 6. Packs table
-- ========================
CREATE TABLE IF NOT EXISTS packs (
    pack_id SERIAL PRIMARY KEY,
    pack_name VARCHAR(100) NOT NULL UNIQUE,
    price INT NOT NULL,
    description TEXT
);

-- ========================
-- 7. User_Packs table (junction)
-- ========================
CREATE TABLE IF NOT EXISTS user_packs (
    user_pack_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    pack_id INT NOT NULL REFERENCES packs(pack_id) ON DELETE CASCADE,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, pack_id)
);

-- ========================
-- 8. Pack_Rewards table
-- ========================
CREATE TABLE IF NOT EXISTS pack_rewards (
    reward_id SERIAL PRIMARY KEY,
    pack_id INT NOT NULL REFERENCES packs(pack_id) ON DELETE CASCADE,
    item_id INT REFERENCES items(item_id) ON DELETE SET NULL,
    legend_id INT REFERENCES legends(legend_id) ON DELETE SET NULL,
    drop_rate DECIMAL(5,2) NOT NULL
);

-- ========================
-- 9. User_Items table
-- ========================
CREATE TABLE IF NOT EXISTS user_items (
    user_item_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,          -- e.g. 'BUY_PACK' or 'OPEN_PACK'
    pack_id INT REFERENCES packs(pack_id) ON DELETE SET NULL,
    reward_id INT REFERENCES pack_rewards(pack_reward_id) ON DELETE SET NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);`

