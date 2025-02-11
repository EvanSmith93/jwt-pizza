import { test, expect } from "playwright-test-coverage";
import { mockAuthRoute } from "./testMocks";

test("register", async ({ page }) => {
  await mockAuthRoute(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("main").getByText("Login").click();
  await expect(page.getByRole("heading")).toContainText("Welcome back");
  await page.getByRole("main").getByText("Register").click();
  await page.getByRole("textbox", { name: "Full name" }).fill("John Smith");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("test@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("mypassword");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("link", { name: "JS" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Logout" })).not.toBeVisible();
});

test("login and logout", async ({ page }) => {
  await mockAuthRoute(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("link", { name: "KC" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
  await expect(page.locator("#navbar-dark")).not.toContainText("Login");
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.locator("#navbar-dark")).toContainText("Login");
});

test("view use page", async ({ page }) => {
  await mockAuthRoute(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole('link', { name: 'KC' }).click();
  await expect(page.getByRole('main')).toContainText('Kai Chen');
  await expect(page.getByText('a@jwt.com')).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
});