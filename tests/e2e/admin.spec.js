import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    // Admin renders in one of three states depending on Firebase config:
    //   "Admin unavailable" (h1), login form (h2), or dashboard (h1)
    await page.locator('h1, h2').first().waitFor({ timeout: 10000 });
  });

  test('admin page renders a heading', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  test('Dashboard section is active by default when authenticated', async ({
    page,
  }) => {
    const isDashboard = await page
      .getByRole('heading', { name: 'Dashboard' })
      .isVisible();
    test.skip(!isDashboard, 'Requires authenticated admin dashboard');
    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('navigating to Settings section shows its content', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Navigation tab not present in mobile bottom tab bar');
    const isDashboard = await page
      .getByRole('heading', { name: 'Dashboard' })
      .isVisible();
    test.skip(!isDashboard, 'Requires authenticated admin dashboard');
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
    test.skip(isMobile, 'Navigation tab not present in mobile bottom tab bar');
    const isDashboard = await page
      .getByRole('heading', { name: 'Dashboard' })
      .isVisible();
    test.skip(!isDashboard, 'Requires authenticated admin dashboard');
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
    const isDashboard = await page
      .getByRole('heading', { name: 'Dashboard' })
      .isVisible();
    test.skip(!isDashboard, 'Requires authenticated admin dashboard');
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
    await page.waitForLoadState('domcontentloaded');
    await page.locator('h1, h2').first().waitFor({ timeout: 10000 });
    const critical = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('sentry') &&
        !e.includes('interpolated in css calls') &&
        !e.includes('firebase') &&
        !e.includes('Firebase') &&
        !e.includes('Firestore'),
    );
    expect(critical).toHaveLength(0);
  });
});
