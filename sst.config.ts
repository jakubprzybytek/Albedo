import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { Frontend } from "./stacks/Frontend";

export default {
  config(_input) {
    return {
      name: "Albedo",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
      // srcPath: "api",
      // bundle: {
      //     format: "esm",
      // },
    });

    app.stack(API).stack(Frontend);
  }
} satisfies SSTConfig;
