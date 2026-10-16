import sqlite3 from "bun:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "..", "data", "cooking.db");

const db = new sqlite3(DB_PATH);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_id INTEGER NOT NULL,
    meal_type TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dish_id) REFERENCES dishes(id)
  );

  CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
  CREATE INDEX IF NOT EXISTS idx_meals_meal_type ON meals(meal_type);
`);

// Helper functions
export const db = {
  insertDish: (name: string, category: string, imageUrl?: string, notes?: string) => {
    const stmt = db.prepare(
      "INSERT INTO dishes (name, category, image_url, notes) VALUES (?, ?, ?, ?)"
    );
    return stmt.run(name, category, imageUrl || null, notes || null);
  },

  getDishById: (id: number) => {
    const stmt = db.prepare("SELECT * FROM dishes WHERE id = ?");
    return stmt.get(id) as any;
  },

  getAllDishes: () => {
    const stmt = db.prepare("SELECT * FROM dishes ORDER BY name");
    return stmt.all() as any;
  },

  insertMeal: (dishId: number, mealType: string, date: string) => {
    const stmt = db.prepare(
      "INSERT INTO meals (dish_id, meal_type, date) VALUES (?, ?, ?)"
    );
    return stmt.run(dishId, mealType, date);
  },

  getMealsByMonth: (month: string) => {
    const stmt = db.prepare(
      "SELECT d.*, m.meal_type FROM dishes d JOIN meals m ON d.id = m.dish_id WHERE m.date LIKE ? ORDER BY m.date DESC, d.name"
    );
    return stmt.all(`%${month}%`) as any;
  },

  deleteDish: (id: number) => {
    const stmt = db.prepare("DELETE FROM dishes WHERE id = ?");
    return stmt.run(id);
  },

  deleteMeal: (id: number) => {
    const stmt = db.prepare("DELETE FROM meals WHERE id = ?");
    return stmt.run(id);
  },

  close: () => db.close(),
};

export default db;
