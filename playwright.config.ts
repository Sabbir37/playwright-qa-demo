import { defineConfig, devices } from "@playwright/test";

const SAUCEDEMO = "https://www.saucedemo.com";

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
      name: "setup",
      testDir: "./tests/setup",
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: SAUCEDEMO },
    },
    {
      name: "chromium",
      testDir: "./tests/ui",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: SAUCEDEMO },
    },
    {
      name: "mobile-safari",
      testDir: "./tests/ui",
      dependencies: ["setup"],
      use: { ...devices["iPhone 15"], baseURL: SAUCEDEMO },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: { baseURL: "https://restful-booker.herokuapp.com" },
    },
  ],
});
