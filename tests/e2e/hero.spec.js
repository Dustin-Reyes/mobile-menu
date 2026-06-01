import { test, expect } from '@playwright/test';

// ─── Hero section ─────────────────────────────────────────────────────────────

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders eyebrow text', async ({ page }) => {
    await expect(page.getByText("Oregon's #1")).toBeVisible();
  });

  test('renders the h1 headline', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Demolition');
    await expect(heading).toContainText('Company');
  });

  test('renders the body copy', async ({ page }) => {
    await expect(
      page.getByText(/licensed, insured, and built for the job/i),
    ).toBeVisible();
  });

  test('quote CTA button is visible and clickable', async ({ page }) => {
    const cta = page.getByRole('button', { name: /get a quote/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();
  });

  test('phone CTA link has correct href', async ({ page }) => {
    const phoneLink = page
      .getByRole('link', { name: '(541) 329-7504', exact: true })
      .first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:+15413297504');
  });

  test('TrustedBanner renders stat numbers', async ({ page }) => {
    await expect(page.getByText('15+')).toBeVisible();
    await expect(page.getByText('500+')).toBeVisible();
    await expect(page.getByText('100%', { exact: true }).first()).toBeVisible();
  });
});
