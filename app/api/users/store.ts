import type { User } from "@/components/UserList/UserList";
import db from "@/lib/db";

type UserInput = Pick<User, "name" | "email">;

export function listUsers(): User[] {
  return db
    .prepare("SELECT id, name, email FROM users ORDER BY id ASC")
    .all() as User[];
}

export function createUser(input: UserInput): User {
  const result = db
    .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
    .run(input.name, input.email);
  return db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(result.lastInsertRowid) as User;
}

export function updateUser(id: number, input: UserInput): User | null {
  const result = db
    .prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
    .run(input.name, input.email, id);
  if (result.changes === 0) return null;
  return db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id) as User;
}

export function removeUser(id: number): boolean {
  return db.prepare("DELETE FROM users WHERE id = ?").run(id).changes > 0;
}
