import { NextResponse } from "next/server";

import { createUser, listUsers } from "./store";

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
    const body = (await request.json()) as { name?: string; email?: string };
    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    return NextResponse.json(await createUser({ name, email }), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid user data" },
      { status: 400 },
    );
  }
}
