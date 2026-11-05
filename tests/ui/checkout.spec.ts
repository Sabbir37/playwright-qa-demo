import { expect, test } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { STANDARD_USER_STATE } from "../setup/auth-state";

test.use({ storageState: STANDARD_USER_STATE });

test.describe("Checkout", { tag: "@regression" }, () => {
  let inventory: InventoryPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory.html");
    inventory = new InventoryPage(page);
    checkout = new CheckoutPage(page);
    await expect(inventory.items).toHaveCount(6);
  });

  test(
    "end-to-end order: cart, details, correct total, confirmation",
    { tag: "@smoke" },
    async ({ page }) => {
      await inventory.addToCart("Sauce Labs Backpack");
      await inventory.addToCart("Sauce Labs Bolt T-Shirt");
      await inventory.openCart();
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);

      await checkout.checkoutButton.click();
      await checkout.fillInfo("Sabbir", "Hossain", "3100");

      const subtotal = CheckoutPage.money(await checkout.subtotal.innerText());
      const tax = CheckoutPage.money(await checkout.tax.innerText());
      const total = CheckoutPage.money(await checkout.total.innerText());
      expect(subtotal).toBeCloseTo(29.99 + 15.99, 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);

      await checkout.finishButton.click();
      await expect(checkout.completeHeader).toHaveText("Thank you for your order!");
      await expect(inventory.cartBadge).toHaveCount(0);
    },
  );

  const requiredFields = [
    { missing: "First Name", first: "", last: "Hossain", zip: "3100" },
    { missing: "Last Name", first: "Sabbir", last: "", zip: "3100" },
    { missing: "Postal Code", first: "Sabbir", last: "Hossain", zip: "" },
  ];

  for (const { missing, first, last, zip } of requiredFields) {
    test(`checkout stops when ${missing} is empty`, async () => {
      await inventory.addToCart("Sauce Labs Backpack");
      await inventory.openCart();
      await checkout.checkoutButton.click();
      await checkout.fillInfo(first, last, zip);
      await expect(checkout.error).toHaveText(`Error: ${missing} is required`);
    });
  }
});
