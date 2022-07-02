import { use, StackContext, NextjsSite } from "@serverless-stack/resources";
import { Main } from "./Main";

export function Frontend({ stack }: StackContext) {

    const { apiUrl } = use(Main);

    const site = new NextjsSite(stack, "Site", {
        path: "frontend",
        environment: {
            NEXT_PUBLIC_API_URL: apiUrl,
        },
    });

    // Show the site URL in the output
    stack.addOutputs({
        URL: site.url,
    });
}
