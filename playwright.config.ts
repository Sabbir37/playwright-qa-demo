import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testDir: "./tests/ui",
      use: { ...devices["Desktop Chrome"], baseURL: "https://www.saucedemo.com" },
    },
    {
      name: "mobile-safari",
      testDir: "./tests/ui",
      use: { ...devices["iPhone 15"], baseURL: "https://www.saucedemo.com" },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: { baseURL: "https://restful-booker.herokuapp.com" },
    },
  ],
});
