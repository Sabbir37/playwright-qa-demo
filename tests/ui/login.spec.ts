import { expect, test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

test.describe("Login", { tag: "@regression" }, () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test("standard user can log in and sees the product list", { tag: "@smoke" }, async ({ page }) => {
    await login.login("standard_user");
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(new InventoryPage(page).title).toHaveText("Products");
  });

  test("locked-out user is blocked with a clear message", async () => {
    await login.login("locked_out_user");
    await login.expectError("Sorry, this user has been locked out.");
  });

  test("wrong password shows a generic error (no hint which field is wrong)", async () => {
    await login.login("standard_user", "wrong_password");
    await login.expectError("Username and password do not match any user in this service");
  });

  test("empty username is rejected", async () => {
    await login.loginButton.click();
    await login.expectError("Username is required");
  });

  test("empty password is rejected", async () => {
    await login.username.fill("standard_user");
    await login.loginButton.click();
    await login.expectError("Password is required");
  });

  test("inventory page cannot be opened without logging in", async ({ page }) => {
    await page.goto("/inventory.html");
    await login.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
