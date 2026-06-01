import { test, expect } from '@playwright/test';

// ─── Header ───────────────────────────────────────────────────────────────────

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the logo linking to home', async ({ page }) => {
    const logo = page.getByRole('link', { name: 'Titan Demo – Home' });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('renders desktop nav items', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Services' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'FAQ' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Contact' })).toBeVisible();
  });

  test('opens and closes the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const openBtn = page.getByRole('button', { name: 'Open navigation menu' });
    const mobileMenu = page.locator('#mobile-menu');

    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
    await openBtn.click();
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');

    const closeBtn = page.getByRole('button', {
      name: 'Close navigation menu',
    });
    await closeBtn.click();
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('closes the mobile menu with Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const openBtn = page.getByRole('button', { name: 'Open navigation menu' });
    const mobileMenu = page.locator('#mobile-menu');

    await openBtn.click();
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
    await page.keyboard.press('Escape');
    await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('mobile menu contains phone link and CTA button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole('button', { name: 'Open navigation menu' }).click();

    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu.getByRole('link', { name: /541/ })).toHaveAttribute(
      'href',
      'tel:+15413297504',
    );
    await expect(
      mobileMenu.getByRole('button', { name: /get a quote/i }),
    ).toBeVisible();
  });

  test('theme toggle button is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const themeBtn = page.getByRole('button', {
      name: /switch to (dark|light) mode/i,
    });
    await expect(themeBtn).toBeVisible();
  });
});
