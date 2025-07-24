# Honda Future Scenario - AWS Infrastructure
This project (or sub-project) defines the iaac for the Honda Future Scenario project. See infrastructure diagram [here](./architecture.png).<br>
The project expects that you have alredy installed and setup the [aws cli](https://aws.amazon.com/cli/) and the (cdk cli)[https://docs.aws.amazon.com/cdk/v2/guide/cli.html].
The project also expects that you have already configured an aws access profile. If not, run command ```aws configure``` and follow the steps.

## Deployment instructions
<i>Make sure that the aws account/region is bootstrapped before deploying any cdk related updates. Run command ```cdk bootstrap``` to do this.</i>
- Create a code connection between AWS account and the repository. This is a manual step and needs to be done before we can use code pipeline.
- Create a new config file in [config](./config/) folder. File name can be the environment name. Example, prod, dev, stg, etc...
- Add any property values which are different from the [default.json](./config/default.json) to this new file.
<br>Example: The below config only overrides the environment name, hostedzone domain and the secrets name.
```json
{
    "environment": "prod",
    "hostedzone": {
        "domain": "www.hondafuturescenario.com"
    },
    "secrets": {
        "name": "honda-future-secrets-23082025"
    }
}
```
- Deploy the secrets stack first. Then add all environment variables which are mentioned in the [ECS task definition](./lib/honda-future-scenario-stack.ts). If these values do not exist, then the ECS deployment will fail and stack deployment will rollback.
- Deploy the hosted zone stack which contains the SSL certificate second.
- Set the desiredtaskcount in the nextservice config to 0 till the first code build is successfully run. If there's no image in ECR, the fargate containers can not be initialized. Set the desiredtaskcount after running the code build or manually uploading an image to the repository.
- Deploy the honda-future-scenario-stack.

### Important config notes
- Ensure that the environment is different from default. This is used to separate the deployment stack if multiple stages using this stack are deployed to the same AWS account.
- Make sure that there is a suffix or a prefix to the secrets name. When you delete a secret, it isn't removed for 7 days from AWS. So during that time, you can not create another secret with the same name. In case the stack is destroyed or secret is deleted, redeploying the stack will result in an error if the secret name is not updated. Use a suffix so that you can retain a common secret name whilst maintaining versions.
- Update the nextrepository.repo.owner to the code connection owner name.

### Manually building and uploading to ECR
- If you do not want to use code build to build and push image to ECR, you can do it yourself
- Go to ECR in the AWS console
- Open the repository for the Honda future scenario project
- Click the button "View push commands"
- Follow instructions in the popup. Remember to add the aws profile where and when required. Probably required only while getting the docker login password
- Remember that the ECS fargate task may be setup for arm architecture. So the buildx may have to be used if the manual docker build is run on a x86 or amd64 machine. ```docker buildx build --platform linux/arm64 -t image-name .```


## Useful commands
* ```cdk diff [--all] [--profile <aws_profile>]```    Compares the current state with the updated stack (undeployed)
* ```cdk deploy [--all] [--profile <aws_profile>]```  Deploys any updates to aws account
* ```cdk synth [--all] [--profile <aws_profile>]```   Creates the stack template in yaml or json (based on preference) which can be uploaded to cloud formation
* ```cdk destroy [--all] [--profile <aws_profile>]```   Destroys the stack and any dependent stacks. For full control, destroy from the cloudfromation service on aws console.

### Command execution guidelines
* Specify the NODE_ENV env var with the value of the config file that you want to choose. If nothing is specified or variable is not defined, the default config is picked. <b>Example:</b> To dpeloy the secrets-stack to prod, after creating the prod.json config, run command ```NODE_env=prod cdk deploy prod-Secrets-Stack --profile honda```. The stack is deployed to the prod-Secrets-Stack is then deployed.
* If you do not want to run all stacks in the command, specify the stack name. If not, add the --all attribute which runs cdk command against all stacks.
* If you have multiple aws profiles, specify the profile in --profile attribute.
* The stack name is not the same as the file name. it comes from the name defined in infrastructure.ts. It is formatted to {environmnet}-{stack-name} where environment is specified in the config file.
* See ```cdk help``` for more options.