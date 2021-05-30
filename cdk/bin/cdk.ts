#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AlbedoBuildStack } from '../lib/albedo-build-stack';

const app = new cdk.App();
new AlbedoBuildStack(app, 'AlbedoBuildStack', {
  env: { account: '198805281865', region: 'eu-west-1' },
});
