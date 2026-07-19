type Api = ReturnType<typeof import("./api.js").createApi>;

export function createFrontend(api: Api) {
  const domain = $app.stage === "int"
    ? "albedoonline.com"
    : `${$app.stage}.albedoonline.com`;

  const site = new sst.aws.StaticSite("Site", {
    path: "packages/web",
    build: {
      command: "npm run build",
      output: "build/client",
    },
    domain,
    errorPage: "index.html",
    environment: {
      VITE_AWS_REGION: api.region,
      VITE_API_URL: api.url,
      VITE_USER_POOL_ID: api.userPoolId,
      VITE_USER_POOL_CLIENT_ID: api.userPoolClientId,
    },
  });

  return site;
}
