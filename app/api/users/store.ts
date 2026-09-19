import { asc, eq } from "drizzle-orm";

import db from "@/lib/db";
import { users, type UserRow } from "@/lib/schema";

export type UserRecord = Pick<UserRow, "id" | "name" | "email">;
type UserInput = Pick<UserRecord, "name" | "email">;

export function listUsers(): UserRecord[] {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .orderBy(asc(users.id))
    .all();
}

export function getUser(id: number): UserRecord | null {
  return (
    db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .get() ?? null
  );
}

export function createUser(input: UserInput): UserRecord {
  return db
    .insert(users)
    .values(input)
    .returning({ id: users.id, name: users.name, email: users.email })
    .get();
}

export function updateUser(id: number, input: UserInput): UserRecord | null {
  return (
    db
      .update(users)
      .set(input)
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name, email: users.email })
      .get() ?? null
  );
}

export function removeUser(id: number): boolean {
  return db.delete(users).where(eq(users.id, id)).run().changes > 0;
}
