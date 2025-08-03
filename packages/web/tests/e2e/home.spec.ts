import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Albedo/);
    
    await expect(page.getByText('Dashboard')).toBeVisible();

    await expect(page.locator('.event').first()).toBeVisible();
  });
});
