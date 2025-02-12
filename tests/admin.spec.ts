import { expect, test } from "playwright-test-coverage";
import { mockAuthRoute, mockFranchiseRoute } from "./testMocks";
import { Route } from "@playwright/test";

test("create and delete franchise", async ({ page }) => {
  await mockAuthRoute(page);
  await mockFranchiseRoute(page);
  await page.route("*/**/api/franchise/*", async (route: Route) => {
    if (route.request().method() === "DELETE") {
      const res = {
        message: "franchise deleted",
      };
      await route.fulfill({ json: res });
    } else {
      await route.continue();
    }
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).fill("Test Franchise");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page.getByRole("textbox", { name: "franchisee admin email" }).fill("f@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole('cell', { name: 'Test Franchise' })).toBeVisible();
  await page.getByRole('cell', { name: 'Mark Rober' }).click();
  await page.getByRole('row', { name: 'Test Franchise Mark Rober' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Test Franchise')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
});
