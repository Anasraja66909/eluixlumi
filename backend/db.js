import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Connected to local SQLite database at:", dbPath);
});

// Initialize tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        price REAL NOT NULL,
        original_price REAL,
        discount_label TEXT,
        size TEXT DEFAULT '100ml',
        image_url TEXT,
        images TEXT,
        video_url TEXT,
        notes_top TEXT,
        notes_heart TEXT,
        notes_base TEXT,
        longevity TEXT,
        sillage TEXT,
        season TEXT,
        occasion TEXT,
        long_description TEXT,
        available INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Ensure columns exist (for migration)
    db.run("ALTER TABLE products ADD COLUMN images TEXT", (err) => {});
    db.run("ALTER TABLE products ADD COLUMN video_url TEXT", (err) => {});
    db.run("ALTER TABLE products ADD COLUMN is_featured INTEGER DEFAULT 0", (err) => {});

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        customer_city TEXT,
        customer_address TEXT,
        products TEXT,
        total_amount REAL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const initDb = async () => {
    console.log("Local Database Initialized.");
};

export default { run, all, get, initDb };
