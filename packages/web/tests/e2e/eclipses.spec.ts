import { test, expect } from '@playwright/test';

test.describe('Eclipses Page', () => {
  test('should load eclipses page successfully', async ({ page }) => {
    await page.goto('/eclipses');

    await expect(page.locator('button.submit')).toBeVisible();

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
