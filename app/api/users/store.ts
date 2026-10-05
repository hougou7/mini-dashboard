import { asc, count, eq, or, sql } from "drizzle-orm";

import db from "@/lib/db";
import { users, type UserRow } from "@/lib/schema";
import type { UserListParams, UserListResponse } from "@/types/user";

export type UserRecord = Pick<UserRow, "id" | "name" | "email">;
type UserInput = Pick<UserRecord, "name" | "email">;

export function listUsers({
  search,
  page,
  pageSize,
}: UserListParams): UserListResponse {
  const normalizedSearch = search.trim();
  const searchCondition = normalizedSearch
    ? or(
        sql`instr(lower(${users.name}), lower(${normalizedSearch})) > 0`,
        sql`instr(lower(${users.email}), lower(${normalizedSearch})) > 0`,
      )
    : undefined;
  const total = db
    .select({ value: count() })
    .from(users)
    .where(searchCondition)
    .get()?.value ?? 0;
  const totalUsers = normalizedSearch
    ? db.select({ value: count() }).from(users).get()?.value ?? 0
    : total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const resolvedPage = Math.min(page, totalPages);
  const items = db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(searchCondition)
    .orderBy(asc(users.id))
    .limit(pageSize)
    .offset((resolvedPage - 1) * pageSize)
    .all();

  return {
    items,
    total,
    totalUsers,
    page: resolvedPage,
    pageSize,
    totalPages,
  };
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
