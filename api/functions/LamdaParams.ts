import { APIGatewayProxyEventV2 } from "aws-lambda";

export function mandatoryDate(event: APIGatewayProxyEventV2, paramName: string): Date {
    const dateString = event.queryStringParameters?.[paramName];
    if (dateString === undefined) {
        throw Error(`Mandatory parameter missing '${paramName}'`);
    }
    return new Date(dateString);
}
