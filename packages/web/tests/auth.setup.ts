import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

function getTestCredentials() {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error('TEST_USERNAME and TEST_PASSWORD environment variables must be set');
  }

  return { username, password };
}

setup('authenticate', async ({ page, baseURL }) => {
  console.log('CI mode: ', process.env.CI ?? false);
  console.log('Base URL: ', baseURL);

  const credentials = getTestCredentials();

  await page.goto('/');

  await page.waitForSelector('input[name="username"]');

  await page.fill('input[name="username"]', credentials.username);
  await page.fill('input[name="password"]', credentials.password);

  await page.click('button[type="submit"]');

  await expect(page.getByText('Dashboard')).toBeVisible();

  await page.context().storageState({ path: authFile });
  console.log('Authentication state saved to:', authFile);
});
