# About
This is the Honda Future Scenario project developed by DOT FI to present the honda research work. The app is built as a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dev environment
Update the environment variables: copy .env.example to .env and fill in the environment variables. You may have to get values from external services such as recaptchaV3 and SMTP.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment instructions
- To deploy to AWS, follow the [`cdk readme`](./cdk/README.md)
- To deploy to platform sh, update the appropriate config in the [`platform config`](./.platform.app.yaml) file
- To deploy in a docker container, use the provided (dockerfile)[./dockerfile]
<br>
<b>Note:</b> When deploying outside of AWS, ensure that the aws credentials are specified in the environment variable so the system can communicate with the appropriate aws services. See [`infrastructure`](./cdk/architecture.png) diagram for more information. The next js application is hosted in ECS as task(s) in a service in the "Next JS Application Cluster". Specify an AWS_PROFILE if running on a VM with multiple aws profiles pre-configured. Or use AWS_ACCESS_KEY and AWS_SECRET_KEY env vars to speficy the iam credentials. Use AWS_REGION to specify the region where the services are hosted.

## Local contarinerized instructions
podman run -d --name honda-future-scenario-container -p 3000:3000 -v $(pwd)/.env:/app/.env:Z -v $(pwd)/run.sh:/app/run.sh:Z honda-future-scenario
podman build -t honda-future-scenario -f dockerfile
podman exec -it honda-future-scenario-container /bin/sh