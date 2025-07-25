/*
    Manages all resources required for the honda future scenario project in a single stack.
    Why single stack - easy management. Lowers stack dependencies which makes updates simpler. This project doesn't require complex multi-stack deployments
    Note: Though the entire project is in a single stack, there are some separate stacks that have to be created for very specific reasons (mentioned in stack comments). Everything else is dumpped into this stack

    If the domain is not managed in AWS, then ensure that SES DKIM verification is done manually. Go to SES dashboard and copy the DKIM entries for the identity and update the DNS records for the domain
    Note: In sandbox mode, emails can only be sent to verified identities. So enable production mode in the prod environment.
    
    Make sure that code connections already has connected to the git/gitlab repository. Specify the connection details in the config json
*/
import * as cdk from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { AllowedMethods, Distribution, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { LoadBalancerV2Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BuildEnvironmentVariableType, BuildSpec, ComputeType, LinuxArmBuildImage, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, ContainerImage, ContainerInsights, CpuArchitecture, FargateService, FargateTaskDefinition, LogDrivers, OperatingSystemFamily, PropagatedTagSource, Secret } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, TargetType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { DkimIdentity, EasyDkimSigningKeyLength, EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import config = require('config');
import { createHash } from 'crypto';

export interface HondaFutureScenarioStackProps extends cdk.StackProps {
    hostedZone: IHostedZone | undefined;
    secrets: ISecret;
    domainCertificate: ICertificate;
}

export class HondaFutureScenarioStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: HondaFutureScenarioStackProps) {
        super(scope, id, props);
        // SES configuration (for outbound emails)
        // Ensure DKIM entries are added to the DNS if route53 hosted zone is not used
        // Identity is created only if enableidentity config is true. If not, only emailidentities are created if they are added
        if (config.get('ses.enableidentity')) {
            const sesIdentity = new EmailIdentity(this, "EmailIdentity", {
                identity: props.hostedZone ? Identity.publicHostedZone(props.hostedZone) : Identity.domain(config.get('ses.identity')),
                dkimIdentity: DkimIdentity.easyDkim(EasyDkimSigningKeyLength.RSA_2048_BIT)
            });
        }
        // If there are any email identities, add them as well.
        for (let email of config.get('ses.emailidentities') as string[]) {
            // Create a hash of the email to use as a reference id for the email identity
            const identityHash = createHash('md5').update(email.toLowerCase()).digest('base64').replace(/=+$/, '');
            new EmailIdentity(this, `idenity-${identityHash}`, {
                identity: Identity.email(email.toLowerCase())
            });
        }

        // Define the ECR
        const repositoryName = `${config.get('environment')}-honda-future-scenario-next`;
        const nextRepository = new Repository(this, 'NextRepository', {
            repositoryName,
            lifecycleRules: [{
                maxImageCount: config.get('nextrepository.maxecrimagecount')
            }]
        });

        // Code build, deploy and pipeline projects
        const nextBuildProject = new Project(this, 'NextBuildProject', {
            description: `Build project for ${config.get('environment')} next js application`,
            buildSpec: BuildSpec.fromSourceFilename('buildspec.yml'),
            environment: {
                computeType: ComputeType.SMALL,
                buildImage: LinuxArmBuildImage.AMAZON_LINUX_2023_STANDARD_3_0
            },
            projectName: `${config.get('environment')}-honda-future-scenario`,
            concurrentBuildLimit: 1,
            source: Source.gitHub({
                owner: config.get('nextrepository.repo.owner'),
                repo: config.get('nextrepository.repo.repo'),
                branchOrRef: config.get('nextrepository.repo.branchorref'),
                cloneDepth: 1
            }),
            environmentVariables: {
                "IMAGE_REPO_NAME": {
                    type: BuildEnvironmentVariableType.PLAINTEXT,
                    value: repositoryName
                },
                "ECR_REGISTRY": {
                    type: BuildEnvironmentVariableType.PLAINTEXT,
                    value: `${this.account}.dkr.ecr.${this.region}.amazonaws.com`
                }
            },
            timeout: cdk.Duration.minutes(60),
        });
        nextBuildProject.applyRemovalPolicy(config.get('defaultremovalpolicy'));
        nextRepository.grantPullPush(nextBuildProject);
        nextBuildProject.addToRolePolicy((new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'codeconnections:GetConnectionToken',
                'codeconnections:GetConnection',
                'codeconnections:UseConnection'
            ],
            resources: [
                `arn:aws:codeconnections:${this.region}:${this.account}:connection/${config.get('codeconnection.id')}`
            ]
        })));

        // TODO: Add code deploy with rolling deploy strategy (blue green complexity is not required here)
        // TODO: Add code pipeline with the git triggers

        // VPC components
        // We create VPC with one public subnet and one isolated subnet
        // Use isolated as we do not need any service communicating to the internet using NAT for now.
        // When we need to have a private subnet with internet access, replace the private_isolated subnet with private_with_egress subnet or add a private_with_egress subnet
        const vpc = new Vpc(this, 'VPC', {
            vpcName: `${config.get('environment')}-${config.get('vpc.name')}`,
            maxAzs: 2, // ALB requires minimum of 2 subnets in different AZs
            natGateways: 0, // No NAT gateways. Nothing in prviate subnets require internet access
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'PublicSubnet1',
                    subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'IsolatedSubnet1',
                    subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
            // Gateway endpoints to allow resources to reach S3 and DynamoDB within the AWS network instead of going to public net
            // See https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
            // Enable gatewa endpoints in the future when we decide what services to use from AWS
            // gatewayEndpoints: {
            //     dynamoDBGatewayEndpoint: {
            //         service: GatewayVpcEndpointAwsService.DYNAMODB
            //     },
            //     s3GatewayEndpoint: {
            //         service: GatewayVpcEndpointAwsService.S3
            //     }
            // }
        });

        // TODO: Inject any database definitions here... Remember to add the right permissions to the SG or task role to access the DB
        // Dynamo table to store user action trail... Or mongo?

        // TODO: Inject any EFS definitions here... Primarily required to manage physical volume access to the ECS tasks

        // ECS cluster, load balancer, security group and all the other required resouces
        // Create the security group for the load balancer and next js service
        const nextSecurityGroup = new SecurityGroup(this, 'NextSG', {
            securityGroupName: `${config.get('environment')}-honda-future-scenario-application-sg`,
            vpc: vpc,
            description: `Security group for ${config.get('environment')}-next-js-service`,
            allowAllOutbound: true,
        });
        const applicationLoadBalancer = new ApplicationLoadBalancer(this, 'LoadBalancer', {
            loadBalancerName: `${config.get('environment')}-honda-future-scenario-alb`,
            vpc: vpc,
            securityGroup: nextSecurityGroup,
            internetFacing: true,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
                onePerAz: true, // Required in case multiple public subnets exist. ALB can not be deployed to more than one public subnet in a single AZ
                availabilityZones: vpc.availabilityZones,
            },
        });
        // Create a cluster to deploy the nextjs ecs service
        const cluster = new Cluster(this, 'NextCluster', {
            vpc: vpc,
            clusterName: `${config.get('environment')}-honda-future-scenario`,
            containerInsightsV2: ContainerInsights.ENABLED,
            enableFargateCapacityProviders: true
        });
        // Create a task role to assign the task definition. Include all required policies that the task will require
        const nextTaskRole = new Role(this, 'NextTaskRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess'), // to access secrets
            ]
        });
        nextTaskRole.addToPolicy(new PolicyStatement({
            actions: [
                'logs:DescribeLogGroups',
                'logs:DescribeLogStreams',
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:PutRetentionPolicy',
            ],
            resources: [`arn:aws:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:*:log-stream:*`],
        }));
        nextTaskRole.addToPolicy(new PolicyStatement({
            actions: [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            resources: [
                `arn:aws:ses:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:identity/${config.get('ses.identity')}`
            ]
        }));
        // Define the task and service for nextjs application
        const nextTaskDefinition = new FargateTaskDefinition(this, 'NextTaskDefinition', {
            memoryLimitMiB: config.get('nextservice.taskmemory'),
            cpu: config.get('nextservice.taskvcpu'),
            runtimePlatform: {
                cpuArchitecture: CpuArchitecture.ARM64,
                operatingSystemFamily: OperatingSystemFamily.LINUX,
            },
            taskRole: nextTaskRole,
        });
        // Create a log group to push console logs
        const nextLogGroup = new LogGroup(this, 'NextECSLogGroup', {
            logGroupName: `/ecs/${config.get('environment')}-honda-future-scenario-next-application`,
            removalPolicy: config.get('defaultremovalpolicy'),
            retention: config.get('defaultlogretention'),
        });
        // Create the service container
        nextTaskDefinition.addContainer('NextContainer', {
            image: ContainerImage.fromEcrRepository(nextRepository),    // Get the latest image
            environment: {
                AWS_REGION: cdk.Aws.REGION,
            },
            secrets: {
                NEXT_PUBLIC_RECAPTHA_SITE_KEY: Secret.fromSecretsManager(props.secrets, 'NEXT_PUBLIC_RECAPTHA_SITE_KEY'),
                RECAPTHA_SECRET_KEY: Secret.fromSecretsManager(props.secrets, 'RECAPTHA_SECRET_KEY'),
                CONTACT_FORM_TO_EMAIL: Secret.fromSecretsManager(props.secrets, 'CONTACT_FORM_TO_EMAIL'),
            },
            logging: LogDrivers.awsLogs({
                streamPrefix: 'next-application',
                logGroup: nextLogGroup,
            }),
            portMappings: [
                { containerPort: config.get('nextservice.serviceport') }
            ],
            healthCheck: {
                command: [`curl -f http://0.0.0.0:${config.get('nextservice.serviceport')}/api/health || exit 1`],
                interval: cdk.Duration.seconds(30),
                retries: 3,
                startPeriod: cdk.Duration.seconds(60),
                timeout: cdk.Duration.seconds(5)
            },
        });
        // Create the fargate service which will host the tasks
        const nextService = new FargateService(this, 'NextFargateService', {
            cluster,
            serviceName: 'next-service',
            taskDefinition: nextTaskDefinition,
            desiredCount: config.get('nextservice.desiredtaskcount'),
            securityGroups: [nextSecurityGroup],
            assignPublicIp: true,   // If there's no public ip, the task will not be able to access the internet even if it is in the public subnet
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            healthCheckGracePeriod: cdk.Duration.minutes(5),   // Wait for 5 minutes before checking the health of the service
            minHealthyPercent: 50,   // At least 50% of the tasks should be healthy
            propagateTags: PropagatedTagSource.SERVICE
        });
        // Create a scalable target to assing to the load balancer
        const nextScalableTarget = nextService.autoScaleTaskCount({
            minCapacity: config.get('nextservice.desiredtaskcount'),
            maxCapacity: config.get('nextservice.maxtaskcount'),
        });
        nextScalableTarget.scaleOnMemoryUtilization('NextTargetMemoryScaling', {
            targetUtilizationPercent: 70    // If all tasks in service reach 70% memory, then scale up
        });
        nextScalableTarget.scaleOnCpuUtilization('NextTargetCPUScaling', {
            targetUtilizationPercent: 90    // If all tasks reach 90% CPU utilization, scale up
        });
        // Create the target group and add a listener to it in the load balancer
        const nextTargetGroup = new ApplicationTargetGroup(this, 'NextTG', {
            vpc: vpc,
            targetType: TargetType.IP, // Use IP for Fargate
            port: config.get('nextservice.serviceport'),
            protocol: ApplicationProtocol.HTTP,
            healthCheck: {
                path: '/api/health',
            },
        });
        nextTargetGroup.addTarget(nextService);
        applicationLoadBalancer.addListener('NextServiceHttpListener', {
            protocol: ApplicationProtocol.HTTP,
            open: true,
            defaultTargetGroups: [nextTargetGroup]
        });

        // Distribution components
        // Create the next service origin. Tip: If the application is hosted in the private subnet, use VPC origin as it is more secure. This will require us to shift the resources from public subnet to private subnet with egress. Replace LoadBalancerV2Origin type with VpcOrigin.withApplicationLoadBalancer.
        const nextOrigin = new LoadBalancerV2Origin(applicationLoadBalancer, {
            originId: 'next-service',
            protocolPolicy: OriginProtocolPolicy.HTTP_ONLY
        });
        // Create the cloudfront distribution
        var distribution = new Distribution(this, 'CloudfrontDistribution', {
            comment: config.get('distribution.domain'),
            //Default behavior navigates to the client website
            defaultBehavior: {
                allowedMethods: AllowedMethods.ALLOW_ALL,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                origin: nextOrigin
            },
            // certificate: props.domainCertificate,    // Ensure that the certificate covers the distribution domain. Uncomment when the certificate is ready
            // domainNames: [config.get('distribution.domain')], // Uncomment when the certificate and DNS is ready
            enabled: true,
            logIncludesCookies: true,
            // Where to redirect when an unknown page is called
            errorResponses: [{
                httpStatus: 404,
                responsePagePath: '/404'
            }]
        });
        // Add a dns entry to the hosted zone if we are using hosted zones
        if (props.hostedZone) {
            new ARecord(this, 'CloudFrontDistARecord', {
                zone: props.hostedZone,
                recordName: config.get('distribution.domain'),
                comment: `${config.get('distribution.domain')}`,
                ttl: cdk.Duration.minutes(5),
                target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
            });
        }

        // Apply the default removal policy for any resource that hasn't specified the removal policy
        cdk.RemovalPolicies.of(this).apply(config.get('defaultremovalpolicy'));
        // Tag all resources in the stack
        cdk.Tags.of(this).add('AppName', config.get('tags.appname'));
        cdk.Tags.of(this).add('Environment', config.get('tags.environment'));
    }
}