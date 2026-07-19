/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "Albedo2-2",
      home: "aws",
      providers: {
        aws: {
          region: "eu-west-1",
        },
      },
      removal: input?.stage === "production" ? "retain" : "remove",
    };
  },
  async run() {
    const { createApi } = await import("./infra/api.js");
    const { createFrontend } = await import("./infra/frontend.js");
    const api = createApi();
    const site = createFrontend(api);

    return {
      ApiEndpoint: api.url,
      UserPoolId: api.userPoolId,
      UserPoolClientId: api.userPoolClientId,
      URL: site.url,
    };
  },
});
