# GitHub Actions deploy role

The CI workflow (`.github/workflows/ci-int.yml`) assumes the role `GitHub-Albedo` through the account's GitHub OIDC provider, following the `GitHub-<Repo>` convention used by the other repos. No AWS access keys are stored in GitHub; each run gets short-lived credentials (1 hour). The workflow builds the role's ARN from the repository secret **`AWS_ACCOUNT`** (the AWS account number), so the number stays out of this public repo and is masked in the Actions logs.

The IAM documents that need the account number are kept locally in `infra/github/private/` (gitignored): `trust-policy.json` and the rendered `deploy-policy.json`. The committed `deploy-policy.json` has `ACCOUNT_ID` in its place.

## Role setup

Create it once (admin credentials):

```sh
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
mkdir -p infra/github/private
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" infra/github/deploy-policy.json > infra/github/private/deploy-policy.json

aws iam create-policy --policy-name Albedo-Deployment \
  --policy-document file://infra/github/private/deploy-policy.json \
  --description "SST deployment permissions for the Albedo GitHub Actions role"

aws iam create-role --role-name GitHub-Albedo \
  --assume-role-policy-document file://infra/github/private/trust-policy.json \
  --description "GitHub Actions (jakubprzybytek/Albedo) deploys via SST" \
  --max-session-duration 3600

aws iam attach-role-policy --role-name GitHub-Albedo --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/SST-Deployment
aws iam attach-role-policy --role-name GitHub-Albedo --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/Albedo-Deployment
```

Then add the repository secret `AWS_ACCOUNT` (Settings → Secrets and variables → Actions) with the account number.

## Policies

- **Trust policy** (`infra/github/private/trust-policy.json`): allows `sts:AssumeRoleWithWebIdentity` from the federated principal `arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com`, with `aud` = `sts.amazonaws.com` and `sub` (StringLike) limited to this repository on any branch, tag or environment, in both forms GitHub sends:
  - `repo:jakubprzybytek/Albedo:*` (classic)
  - `repo:jakubprzybytek@90648/Albedo@206846699:*` (owner and repo IDs)

  To update it: `aws iam update-assume-role-policy --role-name GitHub-Albedo --policy-document file://infra/github/private/trust-policy.json`.
- **`Albedo-Deployment`** (`deploy-policy.json`) grants what SST needs for this app, scoped to the `Albedo2-2-*` names SST generates where the service allows it:
  - S3: the site bucket (`albedo2-2-*`) and the SST asset bucket (`sst-asset-*`, Lambda code uploads)
  - API Gateway (REST, eu-west-1), Lambda functions `Albedo2-2-*`, CloudWatch log groups in eu-west-1
  - CloudFront (distribution, function, KeyValueStore), ACM and Route 53 for the `albedoonline.com` site
  - IAM roles `Albedo2-2-*` for the functions; `iam:PassRole` only to `lambda.amazonaws.com`, plus the existing API Gateway CloudWatch role (`codespace-Albedo2-2-API-*`) to `apigateway.amazonaws.com`
  - SSM parameters under `/sst/*`
- The shared **`SST-Deployment`** policy covers the SST state bucket and bootstrap parameters.

## Changing the deploy policy

Render it again (the `sed` line above), then:

```sh
aws iam create-policy-version --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/Albedo-Deployment \
  --policy-document file://infra/github/private/deploy-policy.json --set-as-default
```

IAM keeps at most 5 versions; delete the oldest non-default one with `delete-policy-version`. If a deploy fails with `AccessDenied` / `is not authorized to perform`, add that exact action to the matching statement.
