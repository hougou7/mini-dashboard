import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "database.db");

// Keep one connection per server process during development hot reloads.
const globalForDatabase = globalThis as typeof globalThis & {
  sqlite?: Database.Database;
};

if (!globalForDatabase.sqlite) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  globalForDatabase.sqlite = new Database(databasePath);
  globalForDatabase.sqlite.pragma("journal_mode = WAL");
  globalForDatabase.sqlite.pragma("foreign_keys = ON");
  globalForDatabase.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      email TEXT NOT NULL UNIQUE CHECK (length(trim(email)) > 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const count = globalForDatabase.sqlite
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get() as { count: number };

  if (count.count === 0) {
    const seed = globalForDatabase.sqlite.prepare(
      "INSERT INTO users (name, email) VALUES (?, ?)",
    );
    const seedUsers = [
      ["Leanne Graham", "leanne.graham@example.com"],
      ["Ervin Howell", "ervin.howell@example.com"],
      ["Clementine Bauch", "clementine.bauch@example.com"],
      ["Patricia Lebsack", "patricia.lebsack@example.com"],
      ["Chelsey Dietrich", "chelsey.dietrich@example.com"],
    ] as const;

    const insertSeedUsers = globalForDatabase.sqlite.transaction(() => {
      for (const user of seedUsers) seed.run(...user);
    });
    insertSeedUsers();
  }
}

const db = globalForDatabase.sqlite;

if (!db) {
  throw new Error("SQLite database failed to initialize");
}

export default db;
