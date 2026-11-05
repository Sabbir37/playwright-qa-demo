import { expect, test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

test.describe("Product list", () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login("standard_user");
    inventory = new InventoryPage(page);
    // An empty list would make the sort checks pass on nothing, so wait for it first.
    await expect(inventory.items).toHaveCount(6);
  });

  test("shows all 6 products with a name and a price", async () => {
    await expect(inventory.items).toHaveCount(6);
    for (const price of await inventory.prices()) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test("sorts by price, low to high", async () => {
    await inventory.sortBy("Price (low to high)");
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts by price, high to low", async () => {
    await inventory.sortBy("Price (high to low)");
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("sorts by name, Z to A", async () => {
    await inventory.sortBy("Name (Z to A)");
    const names = await inventory.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test("cart badge follows add and remove", async () => {
    await expect(inventory.cartBadge).toHaveCount(0);
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.addToCart("Sauce Labs Bike Light");
    await expect(inventory.cartBadge).toHaveText("2");
    await inventory.removeFromCart("Sauce Labs Backpack");
    await expect(inventory.cartBadge).toHaveText("1");
  });

  test("cart is kept after a page reload", async ({ page }) => {
    await inventory.addToCart("Sauce Labs Onesie");
    await page.reload();
    await expect(inventory.cartBadge).toHaveText("1");
  });
});
