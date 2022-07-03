import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from "aws-lambda";

export type LambdaType<T> = (event: APIGatewayProxyEventV2) => T;

export const lambdaHandler = <T>(lambda: LambdaType<T>): APIGatewayProxyHandlerV2 => {
    return async function (event: APIGatewayProxyEventV2) {
        try {
            const body = await lambda(event);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            };
        } catch (e) {
            console.error(e);
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(e),
            };
        }
    };
};
