import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    // Wait for the main-content h1 heading, which is visible on all viewports.
    // The sidebar items share the same text but are CSS-hidden on mobile (≤768px)
    // where the bottom tab bar is used instead.
    await page
      .getByRole('heading', { name: 'Dashboard' })
      .waitFor({ timeout: 10000 });
  });

  test('admin page renders the dashboard heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  test('Dashboard section content is visible by default', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('navigating to Settings section shows its content', async ({ page }) => {
    // "Settings" appears in both the desktop sidebar (div) and mobile bottom tab (button).
    // :text-is() exact-match + :visible ensures we click the first visible nav control.
    await page.locator(':text-is("Settings"):visible').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('body')).not.toContainText(
      'Something went wrong',
    );
  });

  test('navigating to Navigation section shows its content', async ({
    page,
    isMobile,
  }) => {
    // The Navigation tab only exists in the desktop sidebar.
    // The mobile bottom tab bar uses "Nav" (abbreviated) with no Analytics or Media entries.
    test.skip(isMobile, 'Navigation tab not present in mobile bottom tab bar');
    await page.getByText('Navigation').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('body')).not.toContainText(
      'Something went wrong',
    );
  });

  test('navigating to Media section shows its content', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Media tab not present in mobile bottom tab bar');
    await page.getByText('Media').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('body')).not.toContainText(
      'Something went wrong',
    );
  });

  test('header is visible on the admin page', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('no critical console errors on admin page load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page
      .getByRole('heading', { name: 'Dashboard' })
      .waitFor({ timeout: 10000 });
    const critical = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('sentry') &&
        !e.includes('interpolated in css calls'), // Emotion dev-mode warning
    );
    expect(critical).toHaveLength(0);
  });
});
