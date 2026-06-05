import { test, expect } from '@playwright/test';

test.describe('Language', () => {
  test('home page renders without errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('TranspiledCode Template')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'Something went wrong',
    );
  });

  test('header is present with language controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });
});
