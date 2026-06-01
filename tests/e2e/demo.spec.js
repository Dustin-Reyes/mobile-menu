import { test, expect } from '@playwright/test';

// ─── Demo page ────────────────────────────────────────────────────────────────

test.describe('Demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
  });

  test('has the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Component Demo | titan-demo');
  });
});
