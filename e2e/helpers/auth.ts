import { Page } from "@playwright/test";

let userCounter = 0;

export function uniqueUser() {
  userCounter++;
  return {
    username: `testuser${Date.now()}${userCounter}`,
    password: "testpass123",
  };
}

export async function registerUser(
  page: Page,
  user?: { username: string; password: string }
) {
  const { username, password } = user ?? uniqueUser();
  await page.goto("/register");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL("/dashboard");
  return { username, password };
}

export async function loginUser(
  page: Page,
  user: { username: string; password: string }
) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/dashboard");
}
