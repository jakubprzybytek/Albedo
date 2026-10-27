import { siteDomain } from "./stage.js";

type Api = ReturnType<typeof import("./api.js").createApi>;

export function createFrontend(api: Api) {
  const site = new sst.aws.StaticSite("Site", {
    path: "packages/web",
    build: {
      command: "npm run build",
      output: "build/client",
    },
    domain: siteDomain,
    errorPage: "index.html",
    environment: {
      // Release tag set by continuous-delivery.yaml; shown in the footer.
      VITE_APP_VERSION: process.env.APP_VERSION ?? "dev",
      VITE_AWS_REGION: api.region,
      VITE_API_URL: api.url,
      VITE_USER_POOL_ID: api.userPoolId,
      VITE_USER_POOL_CLIENT_ID: api.userPoolClientId,
    },
  });

  return site;
}
