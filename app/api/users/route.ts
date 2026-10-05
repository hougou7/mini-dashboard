import { NextResponse } from "next/server";

import { userInputSchema } from "@/lib/validation";
import { USER_PAGE_SIZE } from "@/types/user";
import { createUser, listUsers } from "./store";

function getPositiveInteger(value: string | null, fallback: number, maximum: number) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, maximum);
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
  );
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const search = (searchParams.get("search") ?? "").trim().slice(0, 100);
    const page = getPositiveInteger(searchParams.get("page"), 1, 100_000);
    const pageSize = getPositiveInteger(
      searchParams.get("pageSize"),
      USER_PAGE_SIZE,
      100,
    );

    return NextResponse.json(listUsers({ search, page, pageSize }));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
            { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = userInputSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid user data", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    return NextResponse.json(await createUser(result.data), { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Invalid user data" },
      { status: 400 },
    );
  }
}
