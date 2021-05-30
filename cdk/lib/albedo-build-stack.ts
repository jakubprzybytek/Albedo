import { Stack, StackProps, Construct } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';

export class AlbedoBuildStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'AlbedoProjectRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecr:BatchCheckLayerAvailability',
        'ecr:CompleteLayerUpload',
        'ecr:GetAuthorizationToken',
        'ecr:InitiateLayerUpload',
        'ecr:PutImage',
        'ecr:UploadLayerPart'],
    }));

    new codebuild.Project(this, 'Albedo Project', {
      source: codebuild.Source.gitHub({
        owner: 'jakubprzybytek',
        repo: 'Albedo'
      }),
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        environmentVariables: {
          AWS_DEFAULT_REGION: {
            value: "eu-west-1"
          },
          AWS_ACCOUNT_ID: {
            value: "198805281865"
          },
          IMAGE_REPO_NAME: {
            value: "albedo"
          },
          IMAGE_TAG: {
            value: "latest"
          }
        },
      },
      role: role
    });
  }
}
