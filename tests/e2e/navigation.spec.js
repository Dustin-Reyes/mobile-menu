import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads and shows the site content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('transpiled-web-template')).toBeVisible();
  });

  test('home page displays tech stack pills', async ({ page }) => {
    await page.goto('/');
    const STACK = [
      'Vite 6',
      'React 18',
      'Emotion',
      'Radix UI',
      'Framer Motion',
      'Jest',
      'Playwright',
    ];
    for (const tech of STACK) {
      await expect(page.getByText(tech)).toBeVisible();
    }
  });

  test('header is present on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });

  test('logo in header links back to home', async ({ page }) => {
    await page.goto('/');
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('404 page renders for an unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
  });

  test('404 page has a link back to home that navigates', async ({ page }) => {
    await page.goto('/does-not-exist');
    const homeLink = page.getByRole('link').filter({ hasText: /home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('admin page loads without crashing', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText(
      'Something went wrong',
    );
    // At minimum one interactive element should be rendered
    const hasInteractive = await page.locator('button').count();
    expect(hasInteractive).toBeGreaterThan(0);
  });
});
