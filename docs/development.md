# Development

This app is developed and delivered per the [continuous-delivery standard](https://github.com/jakubprzybytek/agent-playbook/blob/main/skills/continuous-delivery/STANDARD.md): develop on `dev`, every push to `main` goes through `int` to `prod`. This file holds what is specific to this app.

## Stages

| Stage | URL | Notes |
|---|---|---|
| `dev` | https://dev.albedoonline.com (or http://localhost:5173 with `npm run dev`) | yours to develop on |
| `int` | https://int.albedoonline.com | the pipeline's tests |
| `prod` | https://albedoonline.com | live |

Albedo stores no data: the API computes everything from the ephemeris files bundled with the functions (`data/`, `packages/core`). So every stage behaves the same, apart from who may sign in.

What differs per stage is decided in `infra/stage.ts`: the domain and the Cognito groups the API accepts.

## Sign-in and access

- **Pool:** users sign in with the shared Cognito pool `AlbedoUserPool` (`eu-west-1_IVai0KEAA`), which is managed by hand and shared with other apps.
- **App client:** each stage gets its own app client (`albedo-<stage>-web`, made in `infra/api.ts`).
- **Access check:** the REST API's Cognito authorizer accepts a token from any client of the pool. So the handler wrapper (`packages/functions/src/HandlerProxy.ts`, `access.ts`) also checks that the token comes from this stage's client and that the user is in an accepted group:
  - `prod`: `albedo` only
  - `dev` and `int`: `albedo` and `albedo-test`
- **Giving someone access:** add them to the group:
  `aws cognito-idp admin-add-user-to-group --user-pool-id eu-west-1_IVai0KEAA --username <user> --group-name albedo`

## Run locally

```sh
npm run dev -- --stage dev        # sst dev: Lambdas on your machine, site on http://localhost:5173
npm run deploy -- --stage dev     # full deployment (agent sessions, CloudFront)
```

## Tests

| Kind | Command |
|---|---|
| Type check, unit | `npm run typecheck`, `npm test` |
| E2E | `npx sst shell --stage dev -- npm run test:e2e` |

Test user: `albedo-test@albedoonline.com`, group `albedo-test`, password in the SST secret `TestUserPassword` of `dev` and `int`. The E2E tests sign in once (`packages/web/tests/auth.setup.ts`) and refuse to run on `prod`. To test a local site instead of the stage's, set `BASE_URL=http://localhost:5173`.

E2E reports: `npm --prefix packages/web run test:e2e:report`.

## Delivery

`.github/workflows/continuous-delivery.yaml`, per the standard.

- **Releases:** tags `vM.N`, one per release, only going forward, starting at `v0.1`. The version is shown in the footer.
- **After the prod deploy:** the pipeline only checks that the site answers.
- **Rollback:** run Continuous Delivery manually from the release tag ("Use workflow from"; `gh workflow run continuous-delivery.yaml --ref vM.N`).

Ask before pushing changes that touch data, resources holding data, access, or cost (the standard, section 5). Here also: anything that changes the app clients, the accepted groups or the access check.

Dependencies: Dependabot per the [dependabot standard](https://github.com/jakubprzybytek/agent-playbook/blob/main/skills/dependabot/STANDARD.md); pull requests run `.github/workflows/pull-request-checks.yaml`.

## Deviations

- **No integration tests:** the API is covered by unit tests of the functions and by the E2E tests, which call it through the site.
