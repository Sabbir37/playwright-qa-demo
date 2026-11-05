import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { expect, test as setup } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { STANDARD_USER_STATE } from "./auth-state";

/**
 * Logs in once and saves the session. Tests that only need a logged-in user
 * reuse it instead of going through the login form every time.
 */
setup("log in as standard_user and save the session", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login("standard_user");
  await expect(page).toHaveURL(/inventory\.html/);

  const state = await page.context().storageState();
  // SauceDemo sets its session cookie as SameSite=None without Secure. WebKit accepts that,
  // Chromium silently drops it, so a reused session would not work in Chrome. Saving it as
  // Lax keeps it valid for this same-site app in every browser.
  for (const cookie of state.cookies) {
    if (cookie.sameSite === "None" && !cookie.secure) cookie.sameSite = "Lax";
  }
  mkdirSync(dirname(STANDARD_USER_STATE), { recursive: true });
  writeFileSync(STANDARD_USER_STATE, JSON.stringify(state, null, 2));
});
