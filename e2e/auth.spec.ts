import { test, expect } from "@playwright/test";
import { registerUser, loginUser, uniqueUser } from "./helpers/auth";

test.describe("Authentication", () => {
  test("register creates account and redirects to dashboard", async ({
    page,
  }) => {
    const user = uniqueUser();
    await page.goto("/register");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Create Account" }).click();
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

    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("login with non-existent user shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill("nonexistentuser999");
    await page.getByLabel("Password").fill("anypassword");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("register rejects duplicate username", async ({ page }) => {
    const user = uniqueUser();
    await registerUser(page, user);
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("/login");

    await page.goto("/register");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText("Username already taken")).toBeVisible();
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
