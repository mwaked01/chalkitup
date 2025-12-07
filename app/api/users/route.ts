import { NextResponse } from "next/server";
import { getUsers } from "@/lib/users";

export async function GET() {
const users = await getUsers();
return NextResponse.json(users);
}

