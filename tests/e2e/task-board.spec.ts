import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("@smoke creates a task and announces its count", async ({ page }) => {
  await page.getByLabel("New task").fill("Review release readiness");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.locator("#todo-list li")).toHaveCount(1);
  await expect(page.getByRole("status")).toContainText("1 tasks, 0 completed");
});

test("edits, completes, and deletes a task", async ({ page }) => {
  await page.getByLabel("New task").fill("Validate API");
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByRole("button", { name: "Edit Validate API" }).click();
  await page.getByRole("textbox", { name: "Edit task" }).fill("Validate API contract");
  await page.getByRole("button", { name: "Save task" }).click();
  await page.getByRole("checkbox", { name: "Mark Validate API contract complete" }).check();
  await expect(page.getByRole("status")).toContainText("1 completed");
  await page.reload();
  await expect(page.getByText("Validate API contract")).toHaveClass(/completed/);
  await page.getByRole("button", { name: "Delete Validate API contract" }).click();
  await expect(page.getByText("No tasks yet.")).toBeVisible();
});

test("rejects blank and whitespace-only tasks", async ({ page }) => {
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByRole("alert")).toContainText("Enter a task");
  await page.getByLabel("New task").fill("   ");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.locator("#todo-list li")).toHaveCount(0);
});

test("treats user input as text, not HTML", async ({ page }) => {
  await page.getByLabel("New task").fill('<img src=x onerror=alert(1)>');
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.locator("#todo-list img")).toHaveCount(0);
  await expect(page.locator("#todo-list li")).toContainText('<img src=x onerror=alert(1)>');
});

test("keyboard editing can be cancelled", async ({ page }) => {
  await page.getByLabel("New task").fill("Keep original");
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByRole("button", { name: "Edit Keep original" }).click();
  await page.getByRole("textbox", { name: "Edit task" }).fill("Discard this");
  await page.getByRole("textbox", { name: "Edit task" }).press("Escape");
  await expect(page.getByText("Keep original")).toBeVisible();
});

test("health endpoint exposes a minimal status contract", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
