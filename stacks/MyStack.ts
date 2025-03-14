import { StackContext, Auth, Api, Cognito } from "sst/constructs";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";


export function API({ stack }: StackContext) {
  const cognito = new Cognito(stack, "Auth", {
    cdk: {
      userPool: UserPool.fromUserPoolId(stack, "IUserPool", "eu-west-1_IVai0KEAA"),
      userPoolClient: UserPoolClient.fromUserPoolClientId(stack, "IUserPoolClient", "3qt6td581r3qqsk23tgv9r5duh"),
    }
  });
  // const auth = new Auth(stack, "Auth", {
  //   cdk: {
  //     userPool: UserPool.fromUserPoolId(stack, "IUserPool", "eu-west-1_IVai0KEAA"),
  //     userPoolClient: UserPoolClient.fromUserPoolClientId(stack, "IUserPoolClient", "3qt6td581r3qqsk23tgv9r5duh"),
  //   },
  // });

  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
    defaults: {
      // function: {
      //   runtime: 'nodejs16.x',
      //   memorySize: '128 MB',
      //   timeout: '30 seconds'
      // },
      authorizer: "jwt",
      throttle: {
        burst: 1,
        rate: 1
      }
    },
    routes: {
      "GET /": "functions/lambda.handler",
      "GET /api/states": "packages/functions/src/states/getStates.handler",
      "GET /api/ephemeris": "packages/functions/src/ephemeris/getEphemeris.handler",
      "GET /api/separations": "packages/functions/src/separations/getSeparations.handler",
      "GET /api/conjunctions": {
        function: {
          handler: "packages/functions/src/conjunctions/getConjunctions.handler",
          memorySize: '512 MB'
        }
      },
      "GET /api/eclipses": "packages/functions/src/eclipses/getEclipses.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: cognito.userPoolId,
    UserPoolClientId: cognito.userPoolClientId,
  });

  return {
    api,
    cognito
  }
}
