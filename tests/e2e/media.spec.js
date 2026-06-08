import { test, expect } from '@playwright/test';

// These tests require a running dev server with Firebase + R2 configured.
// Run: netlify dev (port 8888) or yarn dev (port 5173 without functions).

test.describe('Media Library', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes test admin credentials are set via PLAYWRIGHT_ADMIN_EMAIL + PLAYWRIGHT_ADMIN_PASSWORD
    // and that the admin UI is at /admin
    await page.goto('/admin');
    await page.fill(
      '[data-testid="email-input"]',
      process.env.PLAYWRIGHT_ADMIN_EMAIL ?? 'admin@test.com',
    );
    await page.fill(
      '[data-testid="password-input"]',
      process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'password',
    );
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/admin**');
  });

  test('upload an image and see it appear in the library', async ({ page }) => {
    await page.click('[data-testid="media-tab"]');
    await page.waitForSelector('text=Media Library');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(1024, 0xff), // minimal fake JPEG
    });

    // Wait for upload + processing to complete (status: ready)
    await expect(page.locator('text=test-image.jpg').first()).toBeVisible({
      timeout: 30000,
    });
  });

  test('delete an image from the library', async ({ page }) => {
    await page.click('[data-testid="media-tab"]');
    await page.waitForSelector('text=Media Library');

    // Assumes at least one image is already in the library
    const firstDeleteBtn = page.locator('[title="Delete"]').first();
    await firstDeleteBtn.click();

    // Confirm dialog
    await page.click('text=Delete');
    await expect(page.locator('text=Image deleted')).toBeVisible({
      timeout: 5000,
    });
  });

  test('assign image to gallery item from content editor', async ({ page }) => {
    await page.click('[data-testid="content-tab"]');
    await page.click('text=Home');
    await page.click('text=Gallery');

    // Add a gallery item if none exist
    const addBtn = page.locator('text=＋ Add Gallery Item');
    if (await addBtn.isVisible()) await addBtn.click();

    await page.click('text=Pick image');
    // MediaPicker opens
    await page.waitForSelector('text=Select Image');
    await page.locator('.media-picker-grid button').first().click();

    // Verify imageUrl is set (image preview appears)
    await expect(
      page.locator('[aria-label="Gallery image"]').first(),
    ).toBeVisible();

    await page.click('text=Save');
    await expect(page.locator('text=Saved')).toBeVisible({
      timeout: 5000,
    });
  });
});
