import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("JWT Pizza");
});

test("404 page", async ({ page }) => {
  await page.goto("/not/a/real/page");
  await expect(page.getByRole("main")).toContainText(
    "It looks like we have dropped a pizza on the floor. Please try another page."
  );
});

test("about page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("franchise page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?"
  );
});

test("history page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
});

test("docs page", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
  await page.getByRole('heading', { name: '[PUT] /api/auth', exact: true }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});
