import { Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

let userCounter = 0;

// Admin client bypasses rate limits for user creation
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export function uniqueUser() {
  userCounter++;
  return {
    email: `testuser${Date.now()}${userCounter}@test.com`,
    password: "testpass123",
  };
}

/**
 * Creates a user via the admin API (no rate limit) then logs in via the UI.
 * This avoids Supabase's signup rate limit during E2E tests.
 */
export async function registerUser(
  page: Page,
  user?: { email: string; password: string }
) {
  const { email, password } = user ?? uniqueUser();

  // Create user via admin API (bypasses rate limits)
  const admin = getAdminClient();
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  // Log in via the UI
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/dashboard");
  return { email, password };
}

export async function loginUser(
  page: Page,
  user: { email: string; password: string }
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/dashboard");
}
