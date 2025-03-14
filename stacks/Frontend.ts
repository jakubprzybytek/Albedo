import { use, StackContext, NextjsSite } from 'sst/constructs';
import { API } from './MyStack';

export function Frontend({ stack }: StackContext) {
    const { cognito, api } = use(API);

    const customDomainPrefix = stack.stage === 'int' ? '' : stack.stage + '.';

    const site = new NextjsSite(stack, 'Site', {
        path: 'packages/dashboard',
        customDomain: {
            hostedZone: 'albedoonline.com',
            domainName: customDomainPrefix + 'albedoonline.com',
        },
        environment: {
            NEXT_PUBLIC_AWS_REGION: stack.region,
            NEXT_PUBLIC_API_URL: api.customDomainUrl || api.url,
            NEXT_PUBLIC_USER_POOL_ID: cognito.userPoolId,
            NEXT_PUBLIC_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
        },
    });

    // Show the site URL in the output
    stack.addOutputs({
        URL: site.url,
    });
}
