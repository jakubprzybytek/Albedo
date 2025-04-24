import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { Frontend } from "./stacks/Frontend";

export default {
  config(_input) {
    return {
      name: "albedo",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API).stack(Frontend);
  }
} satisfies SSTConfig;
