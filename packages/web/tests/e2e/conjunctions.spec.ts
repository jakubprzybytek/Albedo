import { test, expect } from '@playwright/test';

test.describe('Conjunctions Page', () => {
  test('should load conjunctions page successfully', async ({ page }) => {
    await page.goto('/conjunctions');

    await expect(page.locator('button.submit')).toBeVisible();

    const fromDate = page.getByRole('group', { name: 'From (TDE)' }).getByRole('spinbutton');
    await fromDate.nth(0).fill('1');
    await fromDate.nth(1).fill('06');
    await fromDate.nth(2).fill('2026');

    const toDate = page.getByRole('group', { name: 'To (TDE)' }).getByRole('spinbutton');
    await toDate.nth(0).fill('31');
    await toDate.nth(1).fill('12');
    await toDate.nth(2).fill('2026');

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
