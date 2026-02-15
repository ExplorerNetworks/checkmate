import { test, expect } from "@playwright/test";
import { registerUser } from "./helpers/auth";

test.describe("Task Lists", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page);
  });

  test("create a new list and see it on dashboard", async ({ page }) => {
    await page.getByPlaceholder("New list name...").fill("Groceries");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Groceries")).toBeVisible();
    await expect(page.getByText("No tasks yet")).toBeVisible();
  });

  test("rename a list from the detail page", async ({ page }) => {
    await page.getByPlaceholder("New list name...").fill("My List");
    await page.getByRole("button", { name: "Create" }).click();
    await page.getByText("My List").click();
    await page.waitForURL(/\/dashboard\/.+/);

    // Click edit icon next to list name
    await page.locator('[data-testid="EditIcon"]').first().click();
    const input = page.locator("input").first();
    await input.clear();
    await input.fill("Renamed List");
    await input.press("Enter");

    await expect(page.getByText("Renamed List")).toBeVisible();
  });

  test("delete a list from the dashboard", async ({ page }) => {
    await page.getByPlaceholder("New list name...").fill("Delete Me");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Delete Me", { exact: true })).toBeVisible();

    await page.locator('[data-testid="DeleteOutlineIcon"]').first().click();

    // Confirm dialog
    await expect(page.getByText("Delete list")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();

    // After deletion, the card with the list name should be gone
    await expect(
      page.getByText("Delete Me", { exact: true })
    ).not.toBeVisible();
  });

  test("multiple lists appear on dashboard", async ({ page }) => {
    await page.getByPlaceholder("New list name...").fill("First List");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("First List")).toBeVisible();

    await page.getByPlaceholder("New list name...").fill("Second List");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Second List")).toBeVisible();

    // Both lists should be visible
    await expect(page.getByText("First List")).toBeVisible();
    await expect(page.getByText("Second List")).toBeVisible();
  });
});
