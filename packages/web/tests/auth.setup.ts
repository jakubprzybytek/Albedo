import { test as setup, expect } from '@playwright/test';
import { Resource } from 'sst';

// Signs in once as the app's test user (docs/development.md) and saves the session for the other tests.
// Run inside `sst shell --stage <stage>`, which provides the user and its password. Never prints either.
const authFile = 'playwright/.auth/user.json';

// The password is typed here: keep it out of traces.
setup.use({ trace: 'off' });

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', Resource.TestUser.email);
  await page.fill('input[name="password"]', Resource.TestUserPassword.value);
  await page.click('button[type="submit"]');

  await expect(page.getByText('Dashboard')).toBeVisible();

  await page.context().storageState({ path: authFile });
});
