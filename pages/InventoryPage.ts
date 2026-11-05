import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  item(name: string) {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole("button", { name: "Add to cart" }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole("button", { name: "Remove" }).click();
  }

  async sortBy(label: "Name (A to Z)" | "Name (Z to A)" | "Price (low to high)" | "Price (high to low)") {
    await this.sortSelect.selectOption({ label });
  }

  async prices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace("$", "")));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
