import { StackContext, Api } from "@serverless-stack/resources";

export function Main({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        memorySize: 128
      },
      throttle: {
        burst: 1,
        rate: 1
      }
    },
    routes: {
      "GET /": "functions/lambda.handler",
      "GET /lunar-eclipses": "functions/lunarEclipses.handler",
      "GET /ephemeris": "functions/ephemeris.handler",
      "GET /jpl": "functions/jpl.handler",
      "GET /api/states": "functions/states/getStates.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
}
