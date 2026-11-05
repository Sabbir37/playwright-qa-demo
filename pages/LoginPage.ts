import { expect, type Locator, type Page } from "@playwright/test";

export const PASSWORD = "secret_sauce";

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.error = page.locator('[data-test="error"]');
  }

  async open() {
    await this.page.goto("/");
  }

  async login(user: string, password = PASSWORD) {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectError(text: string | RegExp) {
    await expect(this.error).toBeVisible();
    await expect(this.error).toContainText(text);
  }
}
