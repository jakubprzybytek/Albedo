import { describe, expect, it, vi } from "vitest";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { Failure, Success, lambdaHandler } from "./HandlerProxy";
import { mandatoryString } from "./LambdaParams";

const event = (queryStringParameters: Record<string, string> | null = null) => ({
  queryStringParameters,
} as APIGatewayProxyEvent);

describe("lambdaHandler", () => {
  it("parses REST API query-string parameters", () => {
    expect(mandatoryString(event({ target: "Mars" }), "target")).toBe("Mars");
    expect(() => mandatoryString(event(), "target")).toThrow("Mandatory parameter is missing: target");
  });

  it("returns successful JSON with CORS headers", async () => {
    const response = await lambdaHandler(() => Success({ value: 42 }))(event());

    expect(response).toMatchObject({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "GET, POST",
      },
      body: JSON.stringify({ value: 42 }),
    });
  });

  it("returns validation failures with CORS headers", async () => {
    const response = await lambdaHandler(() => Failure("Invalid input"))(event());

    expect(response).toMatchObject({
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Invalid input" }),
    });
  });

  it("returns unhandled exceptions with CORS headers", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await lambdaHandler(() => {
      throw new Error("Unexpected failure");
    })(event());

    expect(response).toMatchObject({
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Unexpected failure" }),
    });
    error.mockRestore();
  });
});
