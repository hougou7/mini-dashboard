import { NextResponse } from "next/server";

import { removeUser, updateUser } from "../store";

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
    const body = (await request.json()) as { name?: string; email?: string };
    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const user = await updateUser(id, { name, email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
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
