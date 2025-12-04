import { StackContext, ApiGatewayV1Api, Cognito } from "sst/constructs";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import * as apig from "aws-cdk-lib/aws-apigateway";


export function API({ stack }: StackContext) {
  const cognito = new Cognito(stack, "Auth", {
    cdk: {
      userPool: UserPool.fromUserPoolId(stack, "IUserPool", "eu-west-1_IVai0KEAA"),
      userPoolClient: UserPoolClient.fromUserPoolClientId(stack, "IUserPoolClient", "3qt6td581r3qqsk23tgv9r5duh"),
    }
  });

  const api = new ApiGatewayV1Api(stack, "restapi", {
    authorizers: {
      jwt: {
        type: "user_pools",
        userPoolIds: [cognito.userPoolId],
      },
    },
    defaults: {
      function: {
        // runtime: 'nodejs16.x',
        memorySize: '512 MB',
        timeout: '30 seconds'
      },
      authorizer: "jwt",
    },
    cdk: {
      restApi: {
        deployOptions: {
          throttlingBurstLimit: 1,
          throttlingRateLimit: 1,
        }
        ,
        defaultCorsPreflightOptions: {
          allowOrigins: apig.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST'],
          allowHeaders: ["Authorization", "Content-Type"],
          // Note: allowCredentials must remain false when using "*" origins
        }
      }
    },

    routes: {
      "GET /api/states": "packages/functions/src/states/getStates.handler",
      "GET /api/ephemeris": "packages/functions/src/ephemeris/getEphemeris.handler",
      "GET /api/separations": "packages/functions/src/separations/getSeparations.handler",
      "GET /api/conjunctions": "packages/functions/src/conjunctions/getConjunctions.handler",
      "GET /api/dso-conjunctions": "packages/functions/src/conjunctions/getDsoConjunctions.handler",
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
