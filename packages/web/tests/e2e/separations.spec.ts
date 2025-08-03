import { test, expect } from '@playwright/test';

test.describe('Separations Page', () => {
  test('should load separations page successfully', async ({ page }) => {
    await page.goto('/separations');

    await expect(page.locator('button.submit')).toBeVisible();

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
