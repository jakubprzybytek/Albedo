import { App } from "@serverless-stack/resources";
import { Main } from "./Main";
import { Frontend } from "./Frontend";

export default function (app: App) {
    app.setDefaultFunctionProps({
        runtime: "nodejs16.x",
        srcPath: "api",
        bundle: {
            format: "esm",
        },
    });
    app.stack(Main).stack(Frontend);
}
