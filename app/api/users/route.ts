import { NextResponse } from "next/server";

import { userInputSchema } from "@/lib/validation";
import { createUser, listUsers } from "./store";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
  );
}

export async function GET() {
  try {
    return NextResponse.json(await listUsers());
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
