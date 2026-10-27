import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { Failure, Success, lambdaHandler } from "./HandlerProxy";
import { mandatoryString } from "./LambdaParams";

const CLIENT = "web-client";
const claims = (groups = "albedo", aud = CLIENT) => ({ aud, sub: "user-1", "cognito:groups": groups });

const event = (
  queryStringParameters: Record<string, string> | null = null,
  authClaims: Record<string, unknown> | null = claims(),
) => ({
  queryStringParameters,
  requestContext: { authorizer: authClaims ? { claims: authClaims } : undefined },
} as unknown as APIGatewayProxyEvent);

beforeEach(() => {
  vi.stubEnv("ACCESS_GROUPS", "albedo,albedo-test");
  vi.stubEnv("USER_POOL_CLIENT_ID", CLIENT);
});
afterEach(() => vi.unstubAllEnvs());

describe("lambdaHandler access", () => {
  const ok = () => Success({ value: 1 });
  const denied = async (e: APIGatewayProxyEvent) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const response = await lambdaHandler(ok)(e, {} as never, () => undefined);
    warn.mockRestore();
    return response;
  };

  it("lets in users of an accepted group", async () => {
    const response = await lambdaHandler(ok)(event(null, claims("other,albedo-test")), {} as never, () => undefined);
    expect(response).toMatchObject({ statusCode: 200 });
  });

  it("rejects users of other apps' groups", async () => {
    expect(await denied(event(null, claims("catalyst-viewer-test")))).toMatchObject({
      statusCode: 403,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  });

  it("rejects users with no group and calls without claims", async () => {
    expect(await denied(event(null, claims("")))).toMatchObject({ statusCode: 403 });
    expect(await denied(event(null, null))).toMatchObject({ statusCode: 403 });
  });

  it("rejects tokens from another app client", async () => {
    expect(await denied(event(null, claims("albedo", "other-client")))).toMatchObject({ statusCode: 403 });
  });

  it("applies the stage's groups: prod rejects the test group, no groups rejects all", async () => {
    vi.stubEnv("ACCESS_GROUPS", "albedo");
    expect(await denied(event(null, claims("albedo-test")))).toMatchObject({ statusCode: 403 });
    vi.stubEnv("ACCESS_GROUPS", "");
    expect(await denied(event(null, claims("albedo")))).toMatchObject({ statusCode: 403 });
  });
});

describe("lambdaHandler", () => {
  it("parses REST API query-string parameters", () => {
    expect(mandatoryString(event({ target: "Mars" }), "target")).toBe("Mars");
    expect(() => mandatoryString(event(), "target")).toThrow("Mandatory parameter is missing: target");
  });

  it("returns successful JSON with CORS headers", async () => {
    const response = await lambdaHandler(() => Success({ value: 42 }))(event(), {} as never, () => undefined);

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
    const response = await lambdaHandler(() => Failure("Invalid input"))(event(), {} as never, () => undefined);

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
    })(event(), {} as never, () => undefined);

    expect(response).toMatchObject({
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Unexpected failure" }),
    });
    error.mockRestore();
  });
});
