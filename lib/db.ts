import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "node:fs";
import path from "node:path";

import * as schema from "./schema";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "database.db");

// Keep one connection per server process during development hot reloads.
const globalForDatabase = globalThis as typeof globalThis & {
  sqlite?: Database.Database;
  drizzle?: BetterSQLite3Database<typeof schema>;
};

if (!globalForDatabase.sqlite) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  globalForDatabase.sqlite = new Database(databasePath);
  globalForDatabase.sqlite.pragma("journal_mode = WAL");
  globalForDatabase.sqlite.pragma("foreign_keys = ON");
}

const sqlite = globalForDatabase.sqlite;

if (!sqlite) {
  throw new Error("SQLite database failed to initialize");
}

const db =
  globalForDatabase.drizzle ??
  (globalForDatabase.drizzle = drizzle(sqlite, { schema }));

migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

const seedUsers = [
  { name: "Leanne Graham", email: "leanne.graham@example.com" },
  { name: "Ervin Howell", email: "ervin.howell@example.com" },
  { name: "Clementine Bauch", email: "clementine.bauch@example.com" },
  { name: "Patricia Lebsack", email: "patricia.lebsack@example.com" },
  { name: "Chelsey Dietrich", email: "chelsey.dietrich@example.com" },
];

if (
  db.select({ id: schema.users.id }).from(schema.users).limit(1).get() ===
  undefined
) {
  db.insert(schema.users).values(seedUsers).run();
}

export { db };
export default db;
