import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("JWT Pizza");
});

test("about page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

test("franchise page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
});