/*
    The stack contains the hosted zone and a domain certificate.
    Hosted zone is used only if it is enabled in the config
    The reason this stack is separate is because the domain certificate needs to be created only in us-east-1 region
*/

import * as cdk from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import config = require('config');

export class HostedZoneStack extends cdk.Stack {
    hostedZone: IHostedZone | undefined;
    domainCertificate: ICertificate;

    constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // Hosted zone and certificates
        // Hosted zone is created only if it is required. If the hosted zone is managed in route 53, then ensure that it exists or throw error. If not, alert the user that they need to manually add any CNAME and DKIM records
        if (config.get('hostedzone.useroute53')) {
            this.hostedZone = HostedZone.fromLookup(this, "ExistingHostedZone", {
                domainName: config.get('hostedzone.domain')
            });
            if (this.hostedZone.hostedZoneId == "DUMMY") {
                throw `No zone found for ${config.get('hostedzone.domain')}`;
            }
            else {
                console.log(`Found existing zone: ${this.hostedZone.hostedZoneArn}`);
            }
        }
        else {
            console.log('DNS managed externaly. Ensure DNS records are manually added to the domain records');
        }

        this.domainCertificate = new Certificate(this, 'DomainCertificate', {
            domainName: config.get('hostedzone.environmentdomain'),
            subjectAlternativeNames: [`*.${config.get('hostedzone.environmentdomain')}`],
            validation: CertificateValidation.fromDns(this.hostedZone),  // Add DNS records to validate certificate if hosted zone is not used
            certificateName: `${config.get('environment')}HondaFutureScenarioDomainCertificate`,
        });

        // Apply the default removal policy for any resource that hasn't specified the removal policy
        cdk.RemovalPolicies.of(this).apply(config.get('defaultremovalpolicy'));
        // Tag all resources in the stack
        cdk.Tags.of(this).add('AppName', config.get('tags.appname'));
        cdk.Tags.of(this).add('Environment', config.get('tags.environment'));
    }
}