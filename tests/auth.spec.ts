import { test, expect } from "playwright-test-coverage";

test("login and logout", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() === "PUT") {
      const req = { email: "a@jwt.com", password: "admin" };
      const res = {
        user: {
          id: 3,
          name: "Kai Chen",
          email: "a@jwt.com",
          roles: [{ role: "admin" }],
        },
        token: "abcdef",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else if (route.request().method() === "DELETE") {
      const res = { message: "logout successful" };
      await route.fulfill({ json: res });
    } else {
      await route.continue();
    }
  });

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
  await expect(page.locator('#navbar-dark')).toContainText('Login');
});
