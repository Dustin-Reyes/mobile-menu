import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test('theme toggle button is present in header', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Use :visible to skip hidden buttons (e.g. the mobile hamburger is hidden
    // on desktop, and the desktop theme toggle is hidden on mobile)
    await expect(
      header.locator('button:visible, [role="switch"]:visible').first(),
    ).toBeVisible();
  });

  test('clicking theme toggle changes the page background', async ({
    page,
    isMobile,
  }) => {
    // The theme toggle lives in the desktop Controls bar (hidden on mobile)
    test.skip(isMobile, 'Theme toggle is in desktop nav, hidden on mobile');
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

  test('theme mode persists across page reload', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Theme toggle is in desktop nav, hidden on mobile');
    await page.goto('/');

    // Toggle once to change theme
    await page.locator('header button[aria-label*="mode"]').click();
    // Wait for CSS transitions to complete before reading color
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
    test.skip(isMobile, 'Theme toggle is in desktop nav, hidden on mobile');
    await page.goto('/');
    await page.locator('header button[aria-label*="mode"]').click();

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('theme-mode'),
    );
    expect(['light', 'dark']).toContain(storedTheme);
  });
});
