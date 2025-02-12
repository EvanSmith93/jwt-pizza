import { Route } from "@playwright/test";
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
  await expect(
    page
      .locator("div")
      .filter({
        hasText:
          /^If you are already a franchisee, pleaseloginusing your franchise account$/,
      })
      .nth(2)
  ).toBeVisible();
});

test("history page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
});

test("docs page", async ({ page }) => {
  await page.route("*/**/api/docs", async (route: Route) => {
    if (route.request().method() === "GET") {
      const res = {
        version: "20240518.154317",
        endpoints: [
          {
            method: "POST",
            path: "/api/auth",
            description: "Register a new user",
            example:
              'curl -X POST localhost:3000/api/auth -d \'{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}\' -H \'Content-Type: application/json\'',
            response: {
              user: {
                id: 2,
                name: "pizza diner",
                email: "d@jwt.com",
                roles: [
                  {
                    role: "diner",
                  },
                ],
              },
              token: "tttttt",
            },
          },
        ],
        config: {
          factory: "https://pizza-factory.cs329.click",
          db: "127.0.0.1",
        },
      };
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });

  await page.goto("/docs");
  await expect(page.getByText("JWT Pizza API")).toBeVisible();
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
  await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
  await page.getByRole("link", { name: "home" }).click();
  await expect(page.getByText("The web's best pizza", { exact: true })).toBeVisible();
});
