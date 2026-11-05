import { expect, test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CheckoutPage } from "../../pages/CheckoutPage";

/**
 * SauceDemo ships special accounts with deliberate bugs. Each test below states the
 * CORRECT behaviour, so it fails while the bug exists. `test.fail()` marks it as an
 * expected failure: the suite stays green, and the moment a bug is fixed the test
 * "unexpectedly passes" and tells us to close the bug. Details: BUGS.md.
 */
async function loginAs(page: import("@playwright/test").Page, user: string) {
  const login = new LoginPage(page);
  await login.open();
  await login.login(user);
  const inventory = new InventoryPage(page);
  // Wait for the list, so an empty page can never make a bug check pass by accident.
  await expect(inventory.items).toHaveCount(6);
  return inventory;
}

test.describe("Known bugs (problem_user / error_user)", () => {
  test("BUG-01: every product shows its own image", async ({ page }) => {
    test.fail(true, "BUG-01: problem_user sees the same image on every product");
    const inventory = await loginAs(page, "problem_user");
    const sources = await inventory.items.locator("img").evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src),
    );
    expect(new Set(sources).size).toBe(sources.length);
  });

  test("BUG-02: sorting by price changes the order", async ({ page }) => {
    test.fail(true, "BUG-02: problem_user's sort dropdown does not re-order products");
    const inventory = await loginAs(page, "problem_user");
    await inventory.sortBy("Price (low to high)");
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("BUG-03: Add to cart works for every product", async ({ page }) => {
    test.fail(true, "BUG-03: some Add to cart buttons do nothing for problem_user");
    const inventory = await loginAs(page, "problem_user");
    const names = await inventory.itemNames.allTextContents();
    for (const name of names) await inventory.addToCart(name);
    await expect(inventory.cartBadge).toHaveText(String(names.length), { timeout: 2000 });
  });

  test("BUG-04: Last Name field keeps what the user types", async ({ page }) => {
    test.fail(true, "BUG-04: Last Name stays empty after typing for problem_user");
    const inventory = await loginAs(page, "problem_user");
    const checkout = new CheckoutPage(page);
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();
    await checkout.checkoutButton.click();
    await checkout.firstName.fill("Sabbir");
    await checkout.lastName.fill("Hossain");
    await expect(checkout.lastName).toHaveValue("Hossain", { timeout: 2000 });
  });

  test("BUG-05: error_user can finish an order", async ({ page }) => {
    test.fail(true, "BUG-05: Finish does not complete the order for error_user");
    const inventory = await loginAs(page, "error_user");
    const checkout = new CheckoutPage(page);
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();
    await checkout.checkoutButton.click();
    await checkout.fillInfo("Sabbir", "Hossain", "3100");
    await checkout.finishButton.click();
    await expect(checkout.completeHeader).toHaveText("Thank you for your order!", { timeout: 3000 });
  });
});
