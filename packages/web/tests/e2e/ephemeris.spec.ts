import { test, expect } from '@playwright/test';

test.describe('Ephemeris Page', () => {
  test('should load ephemeris page successfully', async ({ page }) => {
    await page.goto('/ephemeris');

    await expect(page.locator('button.submit')).toBeVisible();

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
