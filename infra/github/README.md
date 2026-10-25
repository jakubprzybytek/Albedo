# GitHub Actions deploy role

This repo deploys to AWS following the [aws-github-deploy standard](https://github.com/jakubprzybytek/agent-playbook/blob/main/skills/aws-github-deploy/STANDARD.md).

| | |
|---|---|
| Role | `GitHub-Albedo` |
| Policies | `SST-Deployment` (shared), `Albedo-Deployment` (this repo, [deploy-policy.json](deploy-policy.json)) |
| SST app name / resource prefix | `Albedo2-2` (S3 buckets: `albedo2-2-*`) |
| Region | `eu-west-1` (certificate in `us-east-1` for CloudFront) |
| Workflows that deploy | `.github/workflows/ci-int.yml` (stage `int` = albedoonline.com) |
| GitHub | secret `AWS_ACCOUNT_ID`, variable `AWS_REGION` |

`deploy-policy.json` has `ACCOUNT_ID` in place of the account number. The rendered policy and the trust policy are in `private/` (gitignored).

## What the project policy covers

The app is an API Gateway (REST) API with Lambda handlers behind a Cognito authorizer, and a static site on CloudFront.

- `Identity`: `sts:GetCallerIdentity`.
- `SstState`: SST parameters under `/sst/*`.
- `Buckets`: S3 on the site bucket (`albedo2-2-*`) and the SST asset bucket (`sst-asset-*`, Lambda code uploads).
- `ApiGateway`: API Gateway in eu-west-1 (REST API, stages, authorizer, account settings).
- `Functions`: Lambda functions `Albedo2-2-*`.
- `Logs`: CloudWatch log groups in eu-west-1.
- `Edge`: CloudFront (distribution, function, KeyValueStore), ACM certificate and Route 53 records. Account-wide; these services can't be scoped usefully.
- `Roles`: IAM roles `Albedo2-2-*` for the functions.
- `PassFunctionRoles`: pass `Albedo2-2-*` roles to Lambda only.
- `PassApiGatewayLogsRole`: pass the existing API Gateway CloudWatch role (`codespace-Albedo2-2-API-*`) to API Gateway only; the stack's `APIGatewayAccount` resource refers to it.

## Deviations from the standard

- The SST app name is `Albedo2-2`, not the repo name in kebab-case (renaming it would create a new stack). The policy is scoped to the actual name.

## Changing the role or policy

From the repo root, with admin credentials (`aws login`):

```sh
~/.claude/skills/aws-github-deploy/scripts/setup-role.sh Albedo
```

The script is safe to re-run: it renders the documents, publishes a new policy version if the file changed, updates the trust policy and tags, and sets the GitHub secret and variable.
