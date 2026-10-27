import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { anglesReplacer } from "./AnglesReplacer";
import { groupsOf, hasAccess } from "./access";

type LambdaResponse<T> = {
  data: T;
  statusCode: number;
}

type ErrorResponse = {
  message: string;
}

export type LambdaType<T> = (event: APIGatewayProxyEvent) => LambdaResponse<T | ErrorResponse>;

export const Success = <T>(data: T): LambdaResponse<T> => ({ data: data, statusCode: 200 });

export const Failure = (message: string): LambdaResponse<ErrorResponse> => ({ data: { message }, statusCode: 400 });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, POST",
};

export function lambdaHandler<T>(lambda: LambdaType<T>): APIGatewayProxyHandler {
  return async function (event: APIGatewayProxyEvent) {
    const claims = event.requestContext?.authorizer?.claims as Record<string, unknown> | undefined;
    if (!hasAccess(claims)) {
      console.warn("Access denied: wrong app client or none of the accepted groups", { groups: groupsOf(claims), sub: claims?.sub });
      return {
        statusCode: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({ message: "This account has no access to Albedo" }),
      };
    }

    try {
      const response = lambda(event);
      return {
        statusCode: response.statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify(response.data, anglesReplacer),
      };
    } catch (e: unknown) {
      console.error(e);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
        body: JSON.stringify({
          message: e instanceof Error ? e.message : String(e)
        }),
      };
    }
  };
};
