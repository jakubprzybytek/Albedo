const userPoolId = "eu-west-1_IVai0KEAA";
const userPoolClientId = "3qt6td581r3qqsk23tgv9r5duh";
const region = "eu-west-1";

export function createApi() {
  const callerIdentity = aws.getCallerIdentityOutput({});
  const userPoolArn = $interpolate`arn:aws:cognito-idp:${region}:${callerIdentity.accountId}:userpool/${userPoolId}`;

  const api = new sst.aws.ApiGatewayV1("Api", {
    cors: true,
    transform: {
      route: {
        handler: (args) => {
          args.memory ??= "1024 MB";
          args.timeout ??= "30 seconds";
        },
      },
    },
  });

  const authorizer = api.addAuthorizer({
    name: "Cognito",
    userPools: [userPoolArn],
  });

  const auth = {
    cognito: {
      authorizer: authorizer.id,
    },
  };

  const route = (path: string, handler: string, memory?: "1024 MB" | "2048 MB") =>
    api.route(path, { handler, ...(memory && { memory }) }, { auth });

  route("GET /api/states", "packages/functions/src/states/getStates.handler");
  route("GET /api/ephemeris", "packages/functions/src/ephemeris/getEphemeris.handler");
  route("GET /api/altitudes", "packages/functions/src/altitudes/getAltitudes.handler");
  route("GET /api/separations", "packages/functions/src/separations/getSeparations.handler");
  route("GET /api/conjunctions", "packages/functions/src/conjunctions/getConjunctions.handler");
  route("GET /api/dso-conjunctions", "packages/functions/src/conjunctions/getDsoConjunctions.handler", "2048 MB");
  route("GET /api/eclipses", "packages/functions/src/eclipses/getEclipses.handler");

  api.deploy();
  const stage = api.nodes.stage;
  if (!stage) {
    throw new Error("API Gateway stage was not created");
  }

  new aws.apigateway.MethodSettings("ApiThrottle", {
    restApi: api.nodes.api.id,
    stageName: stage.stageName,
    methodPath: "*/*",
    settings: {
      throttlingBurstLimit: 1,
      throttlingRateLimit: 1,
    },
  }, { dependsOn: [stage] });

  return {
    url: api.url,
    userPoolId,
    userPoolClientId,
    region,
  };
}
