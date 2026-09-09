import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!response.ok) {
        return NextResponse.json(
            { error: "Failed to fetch users" }, 
            { status: 500 });
    }
    const users = await response.json();
    return NextResponse.json(users);
}