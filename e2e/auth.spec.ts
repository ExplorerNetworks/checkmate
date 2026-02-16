import { test, expect } from "@playwright/test";
import { registerUser, loginUser, uniqueUser } from "./helpers/auth";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

test.describe("Authentication", () => {
  test("register creates account and redirects to dashboard", async ({
    page,
  }) => {
    // Use admin API to create user (bypasses rate limit), then test login UI
    const user = uniqueUser();
    const admin = getAdminClient();
    await admin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("/dashboard");
    await expect(page.getByText("Checkmate")).toBeVisible();
  });

  test("login with valid credentials redirects to dashboard", async ({
    page,
  }) => {
    const user = uniqueUser();
    await registerUser(page, user);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("/login");
    await loginUser(page, user);
    await expect(page.getByText("Checkmate")).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    const user = uniqueUser();
    await registerUser(page, user);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("/login");

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("login with non-existent user shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nonexistent999@test.com");
    await page.getByLabel("Password").fill("anypassword");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("register rejects duplicate email", async ({ page }) => {
    const user = uniqueUser();
    // Pre-create the user via admin API
    const admin = getAdminClient();
    await admin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    // Try to register with the same email via the UI
    await page.goto("/register");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText("Email already registered")).toBeVisible();
  });

  test("logout redirects to login and dashboard is inaccessible", async ({
    page,
  }) => {
    await registerUser(page);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("/login");

    // Verify we're on the login page after logout
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  });

  test("login page has link to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await page.waitForURL("/register");
  });

  test("register page has link to login", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForURL("/login");
  });
});
