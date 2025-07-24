/*
    The stack contains the secrets resource used to host any protected environment variables
    The reason this stack is separate is because this needs to be deployed first before ECS or code builds are created. In case they rely on the values in secrets
*/

import * as cdk from 'aws-cdk-lib';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import config = require('config');

export class SecretsStack extends cdk.Stack {
    secret: ISecret;

    constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // Define secrets for deployment and other environment variables
        this.secret = new Secret(this, 'Secrets', {
            description: `Secret to store the deployment keys and other environment variables`,
            secretName: `${config.get('environment')}-${config.get('secrets.name')}`
        });

        // Apply the default removal policy for any resource that hasn't specified the removal policy
        cdk.RemovalPolicies.of(this).apply(config.get('defaultremovalpolicy'));
        // Tag all resources in the stack
        cdk.Tags.of(this).add('AppName', config.get('tags.appname'));
        cdk.Tags.of(this).add('Environment', config.get('tags.environment'));
    }
}