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
      test.fail();
    }
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Welcome back")).toBeVisible();
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Test Franchise");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("f@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(
    page.getByRole("cell", { name: "Test Franchise" })
  ).toBeVisible();
  await page.getByRole("cell", { name: "Mark Rober" }).click();
  await page
    .getByRole("row", { name: "Test Franchise Mark Rober" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(page.getByText("Test Franchise")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Mama Ricci's kitchen")).toBeVisible();
});

test("create and delete store", async ({ page }) => {
  await mockAuthRoute(page);
  await mockFranchiseRoute(page);
  await page.route("*/**/api/franchise/*", async (route: Route) => {
    if (route.request().method() === "GET") {
      const res = [
        {
          id: 1,
          name: "Test Franchise",
          admins: [
            {
              id: 1,
              name: "Mark Rober",
              email: "f@jwt.com",
            },
          ],
          stores: [
            {
              id: 4,
              name: "Mars",
            },
          ],
        },
      ];
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });
  await page.route("*/**/api/franchise/*/store", async (route: Route) => {
    if (route.request().method() === "POST") {
      const req = {
        id: "",
        name: "Mars",
      };
      const res = {
        id: 4,
        franchiseId: 1,
        name: "Mars",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });
  await page.route("*/**/api/franchise/*/store/*", async (route: Route) => {
    if (route.request().method() === "DELETE") {
      const res = {
        message: "store deleted",
      };
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });

  await page.goto("/");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("link", { name: "login", exact: true }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Test Franchise")).toBeVisible();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Mars");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name: "Mars" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Are you sure you want to close the Test Franchise store Mars ? This cannot be restored. All outstanding revenue with not be refunded."
  );
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Everything you need to run an JWT Pizza franchise. Your gateway to success."
  );
  await page.getByRole("link", { name: "Logout" }).click();
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?"
  );
});
