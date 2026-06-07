import { defineConfig, devices } from '@playwright/test';

// Use a dedicated port for E2E tests so it never conflicts with the dev server
// (which runs on 5173 via ./dev.sh). Override with PLAYWRIGHT_BASE_URL if needed.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5473';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: `vite --port ${new URL(BASE_URL).port || 5173}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
