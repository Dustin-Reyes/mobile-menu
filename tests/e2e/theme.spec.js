import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test('theme toggle button is present in header', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Use :visible to skip hidden buttons (the mobile hamburger is hidden on
    // desktop; the desktop theme toggle is inside the mobile menu on mobile)
    await expect(
      header.locator('button:visible, [role="switch"]:visible').first(),
    ).toBeVisible();
  });

  test('clicking theme toggle changes the page background', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');
    const bgBefore = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    if (isMobile) {
      // On mobile the toggle lives inside the slide-out menu
      await page.locator('[aria-label="Open menu"]').click();
      await page.locator('button[aria-label*="mode"]:visible').waitFor();
    }
    await page.locator('button[aria-label*="mode"]:visible').click();

    const bgAfter = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bgBefore).not.toBe(bgAfter);
  });

  test('theme mode persists across page reload', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      await page.locator('[aria-label="Open menu"]').click();
      await page.locator('button[aria-label*="mode"]:visible').waitFor();
    }
    await page.locator('button[aria-label*="mode"]:visible').click();
    await page.waitForTimeout(400);

    const bgAfterToggle = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(300);

    const bgAfterReload = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    expect(bgAfterToggle).toBe(bgAfterReload);
  });

  test('theme stored in localStorage as "theme-mode"', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');

    if (isMobile) {
      await page.locator('[aria-label="Open menu"]').click();
      await page.locator('button[aria-label*="mode"]:visible').waitFor();
    }
    await page.locator('button[aria-label*="mode"]:visible').click();

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('theme-mode'),
    );
    expect(['light', 'dark']).toContain(storedTheme);
  });
});
