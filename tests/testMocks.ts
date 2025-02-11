import { Page, Route } from "@playwright/test";
import { expect } from "playwright-test-coverage";

export const mockAuthRoute = async (page: Page) => {
  await page.route("*/**/api/auth", async (route: Route) => {
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
    } else if (route.request().method() === "PUT") {
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
};
