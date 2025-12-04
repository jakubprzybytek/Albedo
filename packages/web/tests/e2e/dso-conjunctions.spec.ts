import { test, expect } from '@playwright/test';

test.describe('DSO Conjunctions Page', () => {
  test('should load DSO conjunctions page successfully', async ({ page }) => {
    await page.goto('/dso-conjunctions');

    await expect(page.locator('button.submit')).toBeVisible();

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
