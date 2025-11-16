/* eslint-disable no-undef */
// @ts-check
import { defineConfig, devices } from "@playwright/test";

// Use fewer browsers in local dev to speed up feedback cycle
let browsers = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "Mobile Chrome",
    use: { ...devices["Pixel 5"] },
  },
];
if (process.env?.CI) {
  browsers = [
    ...browsers,
    ...[
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      },
      {
        name: "Mobile Safari",
        use: { ...devices["iPhone 12"] },
      },
    ],
  ];
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./test",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    // Allow self-signed certificates
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: browsers,
});
