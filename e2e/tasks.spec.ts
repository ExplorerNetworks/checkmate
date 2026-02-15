import { test, expect } from "@playwright/test";
import { registerUser } from "./helpers/auth";

test.describe("Tasks", () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page);
    await page.getByPlaceholder("New list name...").fill("Test List");
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Test List")).toBeVisible();
    await page.getByText("Test List").click();
    await page.waitForURL(/\/dashboard\/.+/);
  });

  test("create a task in a list", async ({ page }) => {
    await page.getByPlaceholder("Add a task...").fill("Buy groceries");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText("Buy groceries")).toBeVisible();
  });

  test("toggle task completion", async ({ page }) => {
    await page.getByPlaceholder("Add a task...").fill("Write tests");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("Write tests")).toBeVisible();

    await page.getByRole("checkbox").click();

    await expect(page.getByText("1 of 1 completed")).toBeVisible();
  });

  test("edit task text", async ({ page }) => {
    await page.getByPlaceholder("Add a task...").fill("Original text");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("Original text")).toBeVisible();

    // Click on the task text to enter edit mode
    await page.getByText("Original text").click();

    const editInput = page.locator('input[type="text"]').last();
    await editInput.clear();
    await editInput.fill("Edited text");
    await editInput.press("Enter");

    await expect(page.getByText("Edited text")).toBeVisible();
    await expect(page.getByText("Original text")).not.toBeVisible();
  });

  test("delete a task", async ({ page }) => {
    await page.getByPlaceholder("Add a task...").fill("To be deleted");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("To be deleted")).toBeVisible();

    // Hover to reveal action buttons, then click delete
    const taskText = page.getByText("To be deleted");
    await taskText.hover();
    // Force click since the button may have opacity 0 until hover CSS triggers
    await page
      .locator('[data-testid="DeleteOutlineIcon"]')
      .first()
      .click({ force: true });

    // Confirm dialog
    await expect(page.getByText("Delete task")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("To be deleted")).not.toBeVisible();
  });

  test("clear completed tasks", async ({ page }) => {
    await page.getByPlaceholder("Add a task...").fill("Task A");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("Task A")).toBeVisible();

    await page.getByPlaceholder("Add a task...").fill("Task B");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText("Task B")).toBeVisible();

    // Complete first task
    await page.getByRole("checkbox").first().click();
    await expect(page.getByText("1 of 2 completed")).toBeVisible();

    // Clear completed
    await page.getByRole("button", { name: /Clear completed/ }).click();

    // Confirm dialog
    await expect(page.getByText("Clear completed tasks")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();

    // Task A gone, Task B remains
    await expect(page.getByText("Task A")).not.toBeVisible();
    await expect(page.getByText("Task B")).toBeVisible();
  });

  test("empty list shows no tasks message", async ({ page }) => {
    await expect(page.getByText("No tasks yet. Add one above!")).toBeVisible();
  });
});
