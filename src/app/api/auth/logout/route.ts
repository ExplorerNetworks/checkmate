import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(clearSessionCookie());
  return response;
}
