# Albedo

## Development

How to develop, test and deliver Albedo, with its stages, test user and access rules: [docs/development.md](docs/development.md).

- **Delivery:** every push to `main` goes through `int` (https://int.albedoonline.com, tested) to `prod` (https://albedoonline.com) via `.github/workflows/continuous-delivery.yaml`.
- **AWS access:** the pipeline signs in to AWS through GitHub OIDC as the IAM role `GitHub-Albedo`, with no AWS access keys stored in GitHub. See [infra/github/README.md](infra/github/README.md).
