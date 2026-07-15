# Albedo

## Deploying

### Prerequisites

- Node.js and npm
- AWS credentials configured for the account where Albedo will run

Install workspace dependencies from the repository root:

```bash
npm install
```

### Development mode

Start the local SST development environment from the repository root:

```bash
npm run dev
```

SST deploys the development stack to AWS, watches for changes, and makes the site URL available in its output. Stop the command when you are finished developing.

### Deployment

Deploy a persistent stack from the repository root:

```bash
npm run deploy
```

Use SST stages to deploy isolated environments when needed:

```bash
npx sst deploy --stage production
```

## E2E Testing

### Prerequisites

- Node.js and npm
- AWS credentials configured for the account containing the Albedo Cognito user pool and API
- Playwright Chromium installed:

```bash
cd packages/web
npx playwright install --with-deps chromium
```

Install workspace dependencies from the repository root if they are not already installed:

```bash
npm install
```

### Test environment

Create `packages/web/.env` with credentials for an existing Cognito test user and the local site URL:

```dotenv
TEST_USERNAME=your-test-user@example.com
TEST_PASSWORD=your-test-password
TEST_BASE_URL=http://localhost:5173
```

Do not add the `VITE_*` authentication or API variables to this file. SST injects them into the web application when it is started from the repository root.

### Run the local environment

Start SST in one terminal from the repository root:

```bash
npm run dev
```

Wait for SST to finish its initial deployment and for the site to be available at the `TEST_BASE_URL` configured above.

### Run the tests

Run the complete E2E suite from a second terminal:

```bash
npm run test:e2e
```

The test command runs the authentication setup project first and stores browser state in `packages/web/playwright/.auth/user.json`. The HTML report is written to `packages/web/playwright-report` and does not open automatically. To inspect it after a run:

```bash
npm --prefix packages/web run test:e2e:report
```

Alternatively, from `packages/web`:

```bash
npm run test:e2e:report
```
