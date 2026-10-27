import { defineConfig, devices } from '@playwright/test';
import { Resource } from 'sst';

// E2E tests against a deployed stage: npx sst shell --stage <stage> -- npm run test:e2e (from the repo root).
// They sign in as the test user, which prod rejects, and must never run there.
if (Resource.App.stage === 'prod') {
  throw new Error('E2E tests never run against prod');
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: process.env.CI ? true : false,
  timeout: 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? undefined : 2,
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL ?? Resource.Site.url,
    /* Keep a trace only for failed tests (uploaded by CI on failure). */
    trace: 'retain-on-failure',
    /* Action timeout (for page.click, page.fill, etc.) */
    actionTimeout: 60 * 1000, // 60 seconds
    /* Navigation timeout (for page.goto, etc.) */
    navigationTimeout: 60 * 1000, // 60 seconds
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use the authentication state from setup
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
