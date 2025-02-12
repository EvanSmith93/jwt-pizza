import { expect, test } from "playwright-test-coverage";
import { Route } from "@playwright/test";
import { mockAuthRoute, mockFranchiseRoute } from "./testMocks";

test("order and verify pizzas", async ({ page }) => {
  await mockAuthRoute(page);
  await mockFranchiseRoute(page);
  await page.route("*/**/api/order/menu", async (route: Route) => {
    if (route.request().method() === "GET") {
      const res = [
        {
          id: 1,
          title: "Veggie",
          image: "pizza1.png",
          price: 0.0038,
          description: "A garden of delight",
        },
        {
          id: 2,
          title: "Pepperoni",
          image: "pizza2.png",
          price: 0.0042,
          description: "Spicy treat",
        },
        {
          id: 3,
          title: "Margarita",
          image: "pizza3.png",
          price: 0.0042,
          description: "Essential classic",
        },
        {
          id: 4,
          title: "Crusty",
          image: "pizza4.png",
          price: 0.0028,
          description: "A dry mouthed favorite",
        },
        {
          id: 5,
          title: "Charred Leopard",
          image: "pizza5.png",
          price: 0.0099,
          description: "For those with a darker side",
        },
      ];
      await route.fulfill({ json: res });
    } else {
      await route.continue();
    }
  });
  await page.route("*/**/api/order", async (route: Route) => {
    if (route.request().method() === "POST") {
      const req = {
        items: [
          {
            menuId: 4,
            description: "Crusty",
            price: 0.0028,
          },
          {
            menuId: 3,
            description: "Margarita",
            price: 0.0042,
          },
          {
            menuId: 3,
            description: "Margarita",
            price: 0.0042,
          },
          {
            menuId: 1,
            description: "Veggie",
            price: 0.0038,
          },
        ],
        storeId: "3",
        franchiseId: 4,
      };
      const res = {
        order: {
          items: [
            {
              menuId: 4,
              description: "Crusty",
              price: 0.0028,
            },
            {
              menuId: 3,
              description: "Margarita",
              price: 0.0042,
            },
            {
              menuId: 3,
              description: "Margarita",
              price: 0.0042,
            },
            {
              menuId: 1,
              description: "Veggie",
              price: 0.0038,
            },
          ],
          storeId: "3",
          franchiseId: 1,
          id: 252,
        },
        jwt: "testOrderingJWT",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else {
      await route.continue();
    }
  });
  await page.route("*/**/api/order/verify", async (route: Route) => {
    if (route.request().method() === "POST") {
      const req = {
        jwt: "testOrderingJWT",
      };
      const res = {
        message: "valid",
        payload: {
          vendor: {
            id: "evan993",
            name: "Evan Smith",
          },
          diner: {
            id: 15810,
            name: "Kai Chen",
            email: "a@jwt.com",
          },
          order: {
            items: [
              {
                menuId: 4,
                description: "Crusty",
                price: 0.0028,
              },
              {
                menuId: 3,
                description: "Margarita",
                price: 0.0042,
              },
              {
                menuId: 3,
                description: "Margarita",
                price: 0.0042,
              },
              {
                menuId: 1,
                description: "Veggie",
                price: 0.0038,
              },
            ],
            storeId: "3",
            franchiseId: 1,
            id: 252,
          },
        },
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else {
      await route.continue();
    }
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Order now" }).click();
  const options = page.getByRole("combobox").locator("option");
  await expect(options).toHaveCount(4);
  await expect(options.nth(0)).toHaveText("choose store");
  await expect(options.nth(1)).toHaveText("SLC");
  await expect(options.nth(2)).toHaveText("Provo");
  await expect(options.nth(3)).toHaveText("Lehi");
  await page.getByRole("combobox").selectOption("3");
  await expect(page.locator("form")).toContainText("Charred Leopard");
  await expect(page.locator("form")).toContainText("Veggie");
  await page.getByRole("link", { name: "Image Description Crusty A" }).click();
  await page.getByRole("link", { name: "Image Description Margarita" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("link", { name: "Image Description Margarita" }).click();
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 4");
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
  await page.getByText("Send me those 4 pizzas right").click();
  await expect(page.getByRole("cell", { name: "0.015 ₿" })).toBeVisible();
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByRole("main")).toContainText("testOrderingJWT");
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page.locator("h3")).toContainText("JWT Pizza - valid");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
});
