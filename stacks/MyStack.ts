import { StackContext, Api, EventBus, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  const site = new StaticSite(stack, "Site", {
    path: "path/to/site",
    customDomain: "my-app.com",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
