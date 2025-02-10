import { test, expect } from "playwright-test-coverage";

test("register", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() === "POST") {
      const req = {
        name: "John Smith",
        email: "test@jwt.com",
        password: "mypassword",
      };
      const res = {
        user: {
          name: "John Smith",
          email: "test@jwt.comm",
          roles: [
            {
              role: "diner",
            },
          ],
          id: 7,
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
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByRole('heading')).toContainText('Welcome to the party');
  await page.getByRole('main').getByText('Login').click();
  await expect(page.getByRole('heading')).toContainText('Welcome back');
  await page.getByRole('main').getByText('Register').click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('John Smith');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('mypassword');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: 'JS' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).not.toBeVisible();
});

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
  await expect(page.locator("#navbar-dark")).toContainText("Login");
});
