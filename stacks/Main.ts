import { StackContext, Auth, Api } from "@serverless-stack/resources";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

export function Main({ stack }: StackContext) {
    const auth = new Auth(stack, "Auth", {
        cdk: {
            userPool: UserPool.fromUserPoolId(stack, "IUserPool", "eu-west-1_IVai0KEAA"),
            userPoolClient: UserPoolClient.fromUserPoolClientId(stack, "IUserPoolClient", "3qt6td581r3qqsk23tgv9r5duh"),
        },
    });

    const api = new Api(stack, "api", {
        authorizers: {
            jwt: {
                type: "user_pool",
                userPool: {
                    id: auth.userPoolId,
                    clientIds: [auth.userPoolClientId],
                },
            },
        },
        defaults: {
            function: {
                runtime: 'nodejs16.x',
                memorySize: 128
            },
            authorizer: "jwt",
            throttle: {
                burst: 1,
                rate: 1
            }
        },
        routes: {
            "GET /": "functions/lambda.handler",
            "GET /lunar-eclipses": "functions/lunarEclipses.handler",
            "GET /ephemeris": "functions/ephemeris.handler",
            "GET /api/states": "functions/states/getStates.handler",
        },
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
        UserPoolId: auth.userPoolId,
        UserPoolClientId: auth.userPoolClientId,
    });

    return {
        api,
        auth
    }
}
