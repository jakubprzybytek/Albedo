import { test, expect } from '@playwright/test';

test.describe('DSO Conjunctions Page', () => {
  test('should load DSO conjunctions page successfully', async ({ page }) => {
    await page.goto('/dso-conjunctions');

    await expect(page.locator('button.submit')).toBeVisible();

    // A fixed range with known results (8 conjunctions for the default observer); the form's
    // default range (the next month) can have none.
    const fromDate = page.getByRole('group', { name: 'From (TDE)' }).getByRole('spinbutton');
    await fromDate.nth(0).fill('1');
    await fromDate.nth(1).fill('01');
    await fromDate.nth(2).fill('2026');

    const toDate = page.getByRole('group', { name: 'To (TDE)' }).getByRole('spinbutton');
    await toDate.nth(0).fill('28');
    await toDate.nth(1).fill('01');
    await toDate.nth(2).fill('2026');

    await page.locator('button.submit').click();

    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
});
