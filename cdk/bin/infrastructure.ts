#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HondaFutureScenarioStack } from '../lib/honda-future-scenario-stack';
import config = require('config');
import { HostedZoneStack } from '../lib/hosted-zone-stack';
import { SecretsStack } from '../lib/secrets-stack';

const app = new cdk.App();
const hostedZoneStack = new HostedZoneStack(app, `${config.get('environment')}-HondaFutureScenario-HostedZone-Stack`, {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' // Domain SSL certificate should exist in us-east-1
  },
});

const secretsStack = new SecretsStack(app, `${config.get('environment')}-HondaFutureScenario-Secrets-Stack`, {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
  },
});

new HondaFutureScenarioStack(app, `${config.get('environment')}-HondaFutureScenario-Application-Stack`, {
  hostedZone: hostedZoneStack.hostedZone,
  domainCertificate: hostedZoneStack.domainCertificate,
  secrets: secretsStack.secret,
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
  },
});