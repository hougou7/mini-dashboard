import { NextResponse } from "next/server";

import { userInputSchema } from "@/lib/validation";
import { removeUser, updateUser } from "../store";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
  );
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getUserId(context: RouteContext) {
  const { id } = await context.params;
  const userId = Number(id);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function PUT(request: Request, context: RouteContext) {
  const id = await getUserId(context);

  if (id === null) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const result = userInputSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid user data", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const user = await updateUser(id, result.data);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
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

export async function DELETE(_request: Request, context: RouteContext) {
  const id = await getUserId(context);

  if (id === null) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    if (!(await removeUser(id))) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
