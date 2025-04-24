import { use, StackContext, NextjsSite, StaticSite } from 'sst/constructs';
import { API } from './MyStack';

export function Frontend({ stack }: StackContext) {
    const { cognito, api } = use(API);

    // const customDomainPrefix = stack.stage === 'int' ? '' : stack.stage + '.';

    const site = new StaticSite(stack, 'Site', {
        path: 'packages/web',
        buildCommand: 'npm run build',
        buildOutput: 'build/client',
        // customDomain: {
        //     hostedZone: 'albedoonline.com',
        //     domainName: customDomainPrefix + 'albedoonline.com',
        // },
        environment: {
            VITE_AWS_REGION: stack.region,
            VITE_API_URL: api.customDomainUrl || api.url,
            VITE_USER_POOL_ID: cognito.userPoolId,
            VITE_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
        },
    });

    // Show the site URL in the output
    stack.addOutputs({
        URL: site.url,
    });
}
