import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  await supabase.auth.signOut();

  const response = NextResponse.json({ message: "Logged out" });

  // Apply Supabase auth cookie deletions to the response
  for (const cookie of pendingCookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>);
  }

  return response;
}
