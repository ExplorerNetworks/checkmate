import { test, expect } from "@playwright/test";
import { registerUser } from "./helpers/auth";

test.describe("Theme switching", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page);
  });

  test("toggle between dark and light mode", async ({ page }) => {
    // Default is light mode — click DarkModeIcon to switch to dark
    const darkToggle = page.locator('[data-testid="DarkModeIcon"]').first();
    await darkToggle.click();

    // Should now show LightModeIcon (meaning we're in dark mode)
    await expect(
      page.locator('[data-testid="LightModeIcon"]').first()
    ).toBeVisible();

    // Toggle back to light
    await page.locator('[data-testid="LightModeIcon"]').first().click();
    await expect(
      page.locator('[data-testid="DarkModeIcon"]').first()
    ).toBeVisible();
  });

  test("open color theme picker", async ({ page }) => {
    await page.locator('[data-testid="PaletteIcon"]').first().click();

    // Popover should appear with "Theme Color" heading
    await expect(page.getByText("Theme Color")).toBeVisible();
  });

  test("theme preference persists across navigation", async ({ page }) => {
    // Toggle to dark mode
    await page.locator('[data-testid="DarkModeIcon"]').first().click();
    await expect(
      page.locator('[data-testid="LightModeIcon"]').first()
    ).toBeVisible();

    // Navigate away and back
    await page.goto("/dashboard");
    await expect(
      page.locator('[data-testid="LightModeIcon"]').first()
    ).toBeVisible();
  });
});
