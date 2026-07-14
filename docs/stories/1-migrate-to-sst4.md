# Migrate Albedo from SST 2 to SST 4.17.1

## Objective

Migrate the Albedo infrastructure from SST 2.49.6 (CDK/CloudFormation) to SST 4.17.1 (Pulumi/Terraform-based components) while preserving the application's observable behavior:

- Deploy to AWS region `eu-west-1`.
- Continue using the existing Cognito user pool and app client.
- Expose the same six authenticated REST API routes.
- Preserve Lambda memory, timeout, CORS, and throttling behavior.
- Build and deploy the React Router SPA.
- Continue using `albedoonline.com` for the `int` stage and `<stage>.albedoonline.com` for other stages.
- Continue deploying the `int` stage from the `main` branch GitHub Actions workflow.

The application has no SST-owned persistent data. Downtime is acceptable. The migration will therefore use a destructive, sequential replacement:

1. Remove the SST 2 deployment and release `albedoonline.com`.
2. Deploy the SST 4 application using the same stage and domain.

The old and new deployments are configured for the same domain, but they will not own it simultaneously.

## Scope

### In scope

- Root SST dependency and lockfile.
- `sst.config.ts`.
- Infrastructure modules currently under `stacks/`.
- API Gateway REST API, Lambda functions, Cognito authorizer, CORS, and throttling.
- Static frontend deployment and build-time environment variables.
- SST-related npm scripts and generated type references.
- GitHub Actions deployment workflow.
- Removal of obsolete SST 2/CDK code and dependencies.
- Destructive cutover of the `int` deployment.

### Out of scope

- Migrating or recreating the existing Cognito user pool.
- Changing API paths or response contracts.
- Moving from API Gateway REST API to HTTP API.
- Refactoring astronomical calculations or UI behavior.
- Introducing databases or other persistent resources.
- Zero-downtime or parallel domain migration.
- Changing the domain naming rules.

## Current infrastructure inventory

### SST application

- SST version: `2.49.6`.
- Application name: `Albedo2-2`.
- AWS region: `eu-west-1`.
- Integration stage: `int`.
- Infrastructure files:
  - `sst.config.ts`
  - `stacks/MyStack.ts`
  - `stacks/Frontend.ts`

### Existing external Cognito resources

These resources already exist and are only referenced by the SST 2 application:

- User pool ID: `eu-west-1_IVai0KEAA`
- User pool client ID: `3qt6td581r3qqsk23tgv9r5duh`

They must not be created, imported into SST state, or removed during the migration. The SST 4 deployment only needs the user pool ID, client ID, and user pool ARN.

### REST API

All routes require the existing Cognito user-pool authorizer.

| Method and path | Handler | Memory | Timeout |
|---|---|---:|---:|
| `GET /api/states` | `packages/functions/src/states/getStates.handler` | 1024 MB | 30 seconds |
| `GET /api/ephemeris` | `packages/functions/src/ephemeris/getEphemeris.handler` | 1024 MB | 30 seconds |
| `GET /api/separations` | `packages/functions/src/separations/getSeparations.handler` | 1024 MB | 30 seconds |
| `GET /api/conjunctions` | `packages/functions/src/conjunctions/getConjunctions.handler` | 1024 MB | 30 seconds |
| `GET /api/dso-conjunctions` | `packages/functions/src/conjunctions/getDsoConjunctions.handler` | 2048 MB | 30 seconds |
| `GET /api/eclipses` | `packages/functions/src/eclipses/getEclipses.handler` | 1024 MB | 30 seconds |

Additional behavior to preserve:

- API Gateway REST API, not API Gateway HTTP API.
- Stage-wide throttle rate of 1 request/second.
- Stage-wide throttle burst of 1 request.
- CORS permits requests from any origin.
- Lambda responses include CORS headers through `HandlerProxy.ts`.

### Static frontend

- Source path: `packages/web`.
- Build command: `npm run build`.
- Build output: `build/client`.
- React Router is configured as a client-side SPA (`ssr: false`).
- Domain rules:
  - `int` -> `albedoonline.com`
  - any other stage -> `<stage>.albedoonline.com`
- Build-time variables:
  - `VITE_AWS_REGION`
  - `VITE_API_URL`
  - `VITE_USER_POOL_ID`
  - `VITE_USER_POOL_CLIENT_ID`

## Target architecture

Use the SST 4 configuration model and the following components:

- `$config` for the application configuration.
- AWS as the application home provider.
- AWS provider configured for `eu-west-1`.
- `sst.aws.ApiGatewayV1` for the REST API.
- `ApiGatewayV1.addAuthorizer()` for the existing Cognito pool.
- `ApiGatewayV1.route()` for each Lambda route.
- `ApiGatewayV1.deploy()` after all routes are registered.
- A low-level `aws.apigateway.MethodSettings` resource for stage throttling.
- `sst.aws.StaticSite` for the SPA.
- The `run()` return value for deployment outputs.

SST 4 has no `StackContext`, `app.stack()`, `use()`, or `stack.addOutputs()`. Infrastructure may still be split into modules, but modules must export ordinary values or factory functions.

## Proposed source layout

Use `infra/` for SST 4 infrastructure and delete `stacks/` after the migration is validated:

```text
infra/
  api.ts
  frontend.ts
sst.config.ts
```

Suggested responsibilities:

- `infra/api.ts`
  - Store or receive the external Cognito identifiers.
  - Obtain the current AWS account ID and region.
  - Construct the existing user pool ARN.
  - Create `sst.aws.ApiGatewayV1`.
  - Create the Cognito authorizer.
  - Register all routes with shared authentication and function defaults.
  - Deploy the API.
  - Apply stage method settings for throttling.
  - Export the API URL and Cognito identifiers required by the frontend.
- `infra/frontend.ts`
  - Derive the stage-specific domain name.
  - Create `sst.aws.StaticSite`.
  - Inject API and Cognito build-time variables.
  - Export the site URL.
- `sst.config.ts`
  - Define application name, home provider, removal policy, and AWS region.
  - Import the API module before the frontend module.
  - Return deployment outputs.

Keeping all resources directly in `sst.config.ts` is valid, but separate modules will preserve the current separation of concerns and keep the migration reviewable.

## Detailed implementation plan

### Phase 1: Establish a migration branch and baseline

1. Create a migration branch before changing dependencies.
2. Record the currently deployed `int` outputs:
   - API URL.
   - Website URL.
   - Cognito user pool ID.
   - Cognito user pool client ID.
3. Run the current test and type-check commands and record existing failures separately from migration regressions:
   - `npm test`
   - `npm run typecheck`
   - package-level type checks as needed
4. Confirm that the Cognito pool and client IDs are external resources and are not created by either CloudFormation stack.
5. Confirm the AWS account hosting the Cognito pool, Route 53 zone, and SST deployment is the same account. If not, configure an explicit provider and construct the user pool ARN with the pool owner's account ID.
6. Confirm that the `1 request/second` and burst `1` API throttle is intentional. Preserve it unless a separate decision changes it.

**Deliverable:** a clean baseline and verified external resource identifiers.

### Phase 2: Upgrade dependencies and initialize SST 4

1. Change the root SST dependency from `2.49.6` to exactly `4.17.1`.
2. Remove direct infrastructure dependencies that are only required by SST 2:
   - `aws-cdk-lib`
   - `constructs`
3. Run `npm install` to regenerate `package-lock.json`.
4. Verify the installed CLI with `npx sst version` and require output `4.17.1`.
5. Run `npx sst install` if provider installation is not performed automatically by another SST command.
6. Do not run an SST 4 deployment against `int` during this phase. Use a temporary development stage for validation until the cutover phase.

**Deliverable:** SST 4.17.1 and its AWS provider installed with no CDK dependency.

### Phase 3: Rewrite `sst.config.ts`

1. Replace the `SSTConfig` export with `$config({...})`.
2. In `app(input)`:
   - Keep the exact application name `Albedo2-2`.
   - Set `home: "aws"`.
   - Configure the AWS provider for `eu-west-1`.
   - Use a removal policy suitable for ephemeral infrastructure. Since there is no SST-owned state and destructive replacement is accepted, `remove` is appropriate for non-production stages. Explicitly define the desired policy rather than relying on defaults.
3. In `async run()`:
   - Load or create the API resources first.
   - Pass API URL and external Cognito identifiers to the frontend module.
   - Create the frontend.
   - Return stable outputs equivalent to the old stack outputs:
     - `ApiEndpoint`
     - `UserPoolId`
     - `UserPoolClientId`
     - `URL`
4. Use `$app.stage` instead of `stack.stage`.
5. Use the configured AWS region/output instead of `stack.region`.

**Verification:** `npx sst diff --stage <temporary-stage>` can evaluate the configuration without the removed SST 2 stack APIs.

### Phase 4: Migrate the API

1. Create `sst.aws.ApiGatewayV1` rather than `ApiGatewayV2` to preserve REST API behavior and minimize Lambda event changes.
2. Configure API CORS. SST 4's `ApiGatewayV1` CORS switch generates wildcard origin/header responses and standard methods. Keep CORS enabled.
3. Obtain the existing Cognito user pool ARN. It has the form:

   `arn:aws:cognito-idp:eu-west-1:<aws-account-id>:userpool/eu-west-1_IVai0KEAA`

   Resolve the account ID from the active AWS provider rather than hardcoding it unless cross-account deployment requires a configured constant.
4. Add a Cognito authorizer using `api.addAuthorizer()` with the existing pool ARN.
5. Define a shared route registration helper or shared argument object that applies:
   - Cognito authorizer ID.
   - 1024 MB memory.
   - 30-second timeout.
6. Register the six existing routes without changing handler paths.
7. Override only `GET /api/dso-conjunctions` to 2048 MB.
8. Call `api.deploy()` only after every route and authorizer has been defined.
9. Add low-level API Gateway method settings after deployment:
   - REST API ID from `api.nodes.api.id`.
   - Stage name from `api.nodes.stage.stageName`.
   - Method path `*/*`.
   - `throttlingRateLimit: 1`.
   - `throttlingBurstLimit: 1`.
10. Ensure the method-settings resource depends on the deployed API stage when dependency inference is insufficient.
11. Export `api.url` for the frontend. The existing API has no custom API domain, so there is no need for a `customDomainUrl` fallback.

**Verification:** SST diff shows one REST API, six Lambda integrations, one Cognito authorizer, an API stage, CORS resources, and method settings.

### Phase 5: Correct and test Lambda event typing

The current REST API handlers are typed as API Gateway payload v2 handlers even though API Gateway REST API normally emits payload v1 events.

1. Change the shared handler/event types in `packages/functions/src/HandlerProxy.ts` from `APIGatewayProxyHandlerV2` and `APIGatewayProxyEventV2` to the corresponding REST API v1 types.
2. Check `packages/functions/src/LambdaParams.ts` and all handlers for fields whose shape differs between payload versions.
3. Preserve response status, JSON serialization, and CORS headers.
4. Add or update unit tests for:
   - Query-string parsing.
   - Successful JSON responses.
   - Validation failures.
   - Unhandled exceptions.
   - CORS headers on success and failure.
5. Delete `packages/functions/src/lambda.ts` if it remains unused. It imports the removed SST 2 `sst/node/api` module and is not attached to a route.

This correction should be committed with the infrastructure migration because it makes the handler contract match the retained REST API. It must not change request or response behavior.

### Phase 6: Migrate the static frontend

1. Replace the SST 2 `StaticSite` construct with `sst.aws.StaticSite`.
2. Preserve `path: "packages/web"`.
3. Convert build properties to the SST 4 nested form:
   - command: `npm run build`
   - output: `build/client`
4. Derive the domain using `$app.stage`:
   - `int` -> `albedoonline.com`
   - other stages -> `${$app.stage}.albedoonline.com`
5. Set the SST 4 site `domain` property to the derived name. The Route 53 hosted zone should be discovered by the default AWS DNS adapter; only provide an explicit zone ID if automatic lookup is ambiguous.
6. Preserve build-time variables:
   - Region: `eu-west-1` or the AWS provider region output.
   - API URL: `api.url`.
   - Existing Cognito pool ID.
   - Existing Cognito pool client ID.
7. Configure SST 4 static-site development behavior to start the React Router development server from `packages/web`, or document that developers should use `sst dev npm run dev --workspace albedo-web`.
8. Verify client-side route fallback behavior after deployment by directly opening at least one non-root application route.

**Verification:** a temporary-stage site builds successfully and receives all four `VITE_*` values.

### Phase 7: Update scripts and generated types

#### Root scripts

1. Keep:
   - `dev: sst dev`
   - `deploy: sst deploy`
   - `remove: sst remove`
2. Replace `build: sst build`, because SST 4 has no `build` command. Use either:
   - `diff: sst diff` for infrastructure validation, and/or
   - a repository build script that explicitly builds/type-checks packages.
3. Remove or replace `console: sst console`; SST 4.17.1 does not expose that CLI command.
4. Consider adding:
   - `sst:version: sst version`
   - `infra:diff: sst diff`

#### Package scripts

1. Change `packages/functions` tests from `sst bind vitest` to `vitest` because tests do not consume linked resources.
2. Change `packages/core` tests from `sst bind vitest` to `vitest` for the same reason.
3. Remove `sst bind` from the web development script. Use plain `react-router dev` when running independently, or let the SST 4 `StaticSite.dev` configuration start it.
4. Use `sst shell <command>` only if future tests or scripts consume linked resources through `Resource`.

#### Generated types

1. Remove stale references to the SST 2 generated path from:
   - `packages/functions/sst-env.d.ts`
   - `packages/core/sst-env.d.ts`
2. Keep the manually maintained Vite environment definitions in `packages/web/src/sst-env.d.ts` unless SST's generated Vite types fully replace them.
3. Run SST once for a temporary stage and inspect generated SST 4 declarations before adding any replacement reference files.
4. Do not add `Resource` imports: the application currently does not use SST resource linking.

**Verification:** repository type checking does not resolve anything from `sst/constructs`, `sst/node/*`, or the SST 2 `.sst/types/index.ts` path.

### Phase 8: Update CI

1. Keep the existing `main` -> `int` deployment behavior.
2. Update GitHub Actions to a maintained checkout action and AWS credentials action while touching the workflow.
3. Continue installing dependencies from `package-lock.json`.
4. Add an explicit SST version check before deployment.
5. Run unit tests and type checks before acquiring deployment credentials where practical.
6. Run `sst deploy --stage int` after AWS credentials are configured.
7. Keep Playwright installation and post-deployment E2E tests.
8. Keep `TEST_BASE_URL=https://albedoonline.com`.
9. Verify that the CI AWS principal can manage the resources required by SST 4 and its state backend, including:
   - SST bootstrap/state resources.
   - IAM roles and policies.
   - Lambda.
   - API Gateway.
   - S3.
   - CloudFront.
   - ACM.
   - Route 53.
   - CloudWatch Logs.
10. Preserve `concurrency.cancel-in-progress: false` so infrastructure deployments cannot cancel each other midway.

**Important:** disable automatic `main` deployments during the one-time destructive cutover, or merge only after the old SST 2 deployment has been removed and the migration operator is ready for SST 4 CI to deploy.

### Phase 9: Validate with a temporary SST 4 stage

Before removing `int`, validate the target configuration with a stage such as `sst4-test`.

1. Deploy the API and site using the temporary stage.
2. The temporary stage will normally request `sst4-test.albedoonline.com`. If that domain must not be created, conditionally omit the site domain only for this disposable validation stage. This exception must not change the final `int` domain configuration.
3. Verify unauthenticated requests to every API route are rejected.
4. Obtain a valid Cognito token and verify every route succeeds with authentication and valid parameters.
5. Verify malformed parameters produce the expected 400 responses.
6. Verify OPTIONS requests and browser requests pass CORS preflight.
7. Verify throttling by sending a controlled short burst and observing API Gateway throttling. Keep this test small to avoid noisy logs.
8. Verify Lambda memory and timeout values in AWS.
9. Verify frontend authentication against the existing pool and client.
10. Verify all frontend pages that call the API.
11. Run the Playwright suite against the temporary site URL where feasible.
12. Remove the temporary SST 4 stage after validation.

**Exit criteria:** the temporary deployment passes authentication, API, frontend, CORS, throttle, unit, type-check, and E2E checks.

## Destructive cutover procedure

The cutover intentionally removes SST 2 before deploying SST 4. Schedule it when temporary downtime is acceptable.

### Pre-cutover checklist

- Migration changes have passed code review.
- SST 4 temporary-stage validation has passed.
- The migration branch is based on the current `main` branch.
- Automatic `main` deployment is paused or controlled.
- AWS credentials for SST 2 removal and SST 4 deployment are available.
- Existing Cognito pool and client IDs have been rechecked.
- The Route 53 hosted zone is accessible to the deployment principal.
- The old API and site outputs have been recorded.
- The operator has both the old SST 2 revision and the new SST 4 revision locally or in CI artifacts.

### Step 1: Remove the SST 2 deployment

1. Check out the final SST 2 revision with SST `2.49.6` installed.
2. Run the SST 2 remove command for stage `int`.
3. Wait for both CloudFormation stacks to finish deleting.
4. Confirm that the old resources are gone:
   - REST API.
   - Six Lambda functions.
   - Static-site S3 bucket and CloudFront distribution, according to the old removal policy.
   - Route 53 alias records created by the old static site.
5. Confirm that the external Cognito user pool and client still exist.
6. Confirm that `albedoonline.com` no longer resolves to the old CloudFront distribution, allowing for DNS caching.

Do not run the removal command from the SST 4 revision; SST 4 cannot remove the SST 2 CloudFormation deployment state.

### Step 2: Deploy SST 4

1. Check out the SST 4 migration revision.
2. Install locked dependencies.
3. Confirm `npx sst version` reports `4.17.1`.
4. Run unit tests and type checks.
5. Run `npx sst diff --stage int` and review the complete resource plan.
6. Run `npx sst deploy --stage int`.
7. Record the SST 4 outputs.
8. Confirm Route 53 points `albedoonline.com` to the new CloudFront distribution.
9. Wait for CloudFront deployment and DNS propagation before starting E2E validation.

### Step 3: Post-deployment verification

1. Open `https://albedoonline.com` and verify the SPA loads.
2. Directly open non-root routes to verify SPA fallback behavior.
3. Sign in through the existing Cognito account flow.
4. Exercise every API-backed feature.
5. Verify each API route with a valid token.
6. Verify an unauthenticated request is rejected.
7. Verify CORS from the deployed frontend origin.
8. Verify CloudWatch API access logs and Lambda logs contain no systematic errors.
9. Run the complete Playwright suite with `TEST_BASE_URL=https://albedoonline.com`.
10. Re-enable automatic `main` deployments after validation succeeds.

## Rollback plan

Because downtime is accepted and the old deployment is deliberately removed, rollback means recreating SST 2 rather than switching traffic between parallel deployments.

If SST 4 deployment or validation fails:

1. Stop automatic deployments.
2. Capture SST 4 deployment errors and state diagnostics.
3. If SST 4 created partial resources, run `sst remove --stage int` from the SST 4 revision. If removal fails, repair/unlock SST state before deleting resources manually.
4. Check out the last known-good SST 2 revision.
5. Install its locked dependencies and confirm SST `2.49.6`.
6. Run `sst deploy --stage int` to recreate the old API and static site on `albedoonline.com`.
7. Run authentication and E2E smoke tests.
8. Keep the migration branch for correction and repeat temporary-stage validation before another cutover.

The external Cognito pool remains available throughout, so rollback does not require restoring users or credentials.

## Cleanup after successful migration

1. Delete `stacks/MyStack.ts` and `stacks/Frontend.ts` after their SST 4 replacements are validated.
2. Delete the empty `stacks/` directory.
3. Delete the unused `packages/functions/src/lambda.ts` handler.
4. Confirm no imports remain from:
   - `sst/constructs`
   - `sst/node/*`
   - `aws-cdk-lib`
   - `constructs`
5. Confirm no source files reference the SST 2 generated `.sst/types/index.ts` path.
6. Confirm no old CloudFormation stacks remain for `Albedo2-2` stage `int`.
7. Confirm no orphaned API Gateway APIs, Lambda functions, CloudFront distributions, S3 buckets, certificates, log groups, or Route 53 records remain from the old deployment.
8. Retain deployment records and old outputs in the migration ticket for audit/debugging purposes.
9. Document the SST 4 state backend and recovery procedure for maintainers.

## Testing matrix

| Area | Test | Expected result |
|---|---|---|
| Configuration | SST version | Exactly `4.17.1` |
| Configuration | SST diff | Completes without SST 2/CDK imports |
| API | Six routes deployed | All route paths and methods unchanged |
| Authentication | Missing token | Rejected by API Gateway |
| Authentication | Valid Cognito token | Request reaches Lambda |
| Authentication | Existing users | Can sign in without migration |
| Lambda | Default memory | 1024 MB |
| Lambda | DSO conjunction memory | 2048 MB |
| Lambda | Timeout | 30 seconds for all routes |
| API | Throttle | Rate 1 and burst 1 applied to `*/*` |
| CORS | OPTIONS preflight | Allows deployed frontend requests |
| Responses | Success/error CORS | Wildcard origin header remains present |
| Frontend | Build | Produces `build/client` |
| Frontend | Build variables | All four `VITE_*` variables populated |
| Frontend | Domain | `int` resolves at `albedoonline.com` |
| Frontend | SPA routing | Direct navigation to client routes works |
| CI | Unit tests/type checks | Pass before deployment |
| CI | Deploy | `sst deploy --stage int` succeeds |
| E2E | Playwright suite | Passes against `https://albedoonline.com` |
| Cleanup | Cognito | Existing pool and client remain unchanged |
| Cleanup | CloudFormation | Old SST 2 stacks no longer exist |

## Acceptance criteria

- Root dependency is exactly SST `4.17.1`.
- `aws-cdk-lib` and `constructs` are no longer direct dependencies.
- Infrastructure uses `$config`, `sst.aws.ApiGatewayV1`, and `sst.aws.StaticSite`.
- No code imports `sst/constructs` or `sst/node/*`.
- The existing Cognito pool and client are reused without being managed by SST 4.
- All six existing REST routes are deployed and Cognito-protected.
- Lambda memory and timeout settings match the SST 2 deployment.
- Stage throttling remains rate 1 and burst 1.
- CORS works for the deployed frontend.
- The SPA is available at `https://albedoonline.com` for `int`.
- All required Vite variables point to the SST 4 API and existing Cognito resources.
- Unit tests, type checks, and Playwright E2E tests pass.
- GitHub Actions deploys SST 4 to `int` from `main`.
- The old SST 2 CloudFormation stacks and transient resources are removed.
- The external Cognito pool and client remain intact.

## Estimated effort

| Task | Estimate |
|---|---:|
| Dependency and configuration migration | 1–2 hours |
| REST API, authorizer, routes, and throttling | 2–4 hours |
| Lambda event typing and tests | 1–2 hours |
| Static site and development workflow | 1–2 hours |
| Scripts, generated types, and CI | 1–2 hours |
| Temporary-stage validation | 2–4 hours |
| Destructive cutover and verification | 2–4 hours |
| **Total** | **10–20 hours** |

The expected implementation difficulty is moderate. Most work is infrastructure configuration and deployment validation; the Lambda business logic and Cognito data do not need migration.
