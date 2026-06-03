import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test('theme toggle button is present in header', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Header has at least one interactive control
    await expect(
      header.locator('button, [role="switch"]').first(),
    ).toBeVisible();
  });

  test('clicking theme toggle changes the page background', async ({
    page,
  }) => {
    await page.goto('/');
    const bgBefore = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    // Click the theme toggle — it's a button with aria-label about mode
    await page.locator('header button[aria-label*="mode"]').click();

    const bgAfter = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    expect(bgBefore).not.toBe(bgAfter);
  });

  test('theme mode persists across page reload', async ({ page }) => {
    await page.goto('/');

    // Toggle once to change theme
    await page.locator('header button[aria-label*="mode"]').click();
    // Wait for CSS transitions to complete before reading color
    await page.waitForTimeout(400);

    const bgAfterToggle = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    const bgAfterReload = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    expect(bgAfterToggle).toBe(bgAfterReload);
  });

  test('theme stored in localStorage as "theme-mode"', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button[aria-label*="mode"]').click();

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('theme-mode'),
    );
    expect(['light', 'dark']).toContain(storedTheme);
  });
});
