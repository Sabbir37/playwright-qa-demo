import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { STANDARD_USER_STATE } from "../setup/auth-state";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Runs axe and fails with a readable list: rule, impact, how many elements, and where. */
async function expectNoWcagViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  const summary = violations.map(
    (v) => `${v.id} (${v.impact}, ${v.nodes.length}x): ${v.help} → ${v.nodes[0]?.target.join(" ")}`,
  );
  expect(summary, "WCAG 2.1 AA violations").toEqual([]);
}

test.describe("Accessibility (WCAG 2.1 AA, axe-core)", { tag: "@a11y" }, () => {
  test("login page", async ({ page }) => {
    await new LoginPage(page).open();
    await expectNoWcagViolations(page);
  });

  test.describe("logged in", () => {
    test.use({ storageState: STANDARD_USER_STATE });

    test("product list", async ({ page }) => {
      await page.goto("/inventory.html");
      await expect(new InventoryPage(page).items).toHaveCount(6);
      await expectNoWcagViolations(page);
    });

    test("checkout form", async ({ page }) => {
      await page.goto("/checkout-step-one.html");
      await expect(page.locator('[data-test="firstName"]')).toBeVisible();
      await expectNoWcagViolations(page);
    });
  });

  test("login works with the keyboard only (no mouse)", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard navigation is a desktop check");
    const login = new LoginPage(page);
    await login.open();
    await login.username.focus();
    await page.keyboard.type("standard_user");
    await page.keyboard.press("Tab");
    await expect(login.password).toBeFocused();
    await page.keyboard.type("secret_sauce");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
