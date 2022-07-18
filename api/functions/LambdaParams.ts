import { APIGatewayProxyEventV2 } from "aws-lambda";
import { JplBody, jplBodyFromString } from '../jpl';

export function mandatoryString(event: APIGatewayProxyEventV2, paramName: string): string {
    const stringValue = event.queryStringParameters?.[paramName];
    if (stringValue === undefined) {
        throw Error(`Mandatory parameter is missing: ${paramName}`);
    }
    return stringValue;
}

export function mandatoryFloat(event: APIGatewayProxyEventV2, paramName: string): number {
    const numberString = event.queryStringParameters?.[paramName];
    if (numberString === undefined) {
        throw Error(`Mandatory parameter is missing: ${paramName}`);
    }
    return Number.parseFloat(numberString);
}

export function mandatoryDate(event: APIGatewayProxyEventV2, paramName: string): Date {
    const dateString = event.queryStringParameters?.[paramName];
    if (dateString === undefined) {
        throw Error(`Mandatory parameter missing '${paramName}'`);
    }
    return new Date(dateString);
}

export function mandatoryJplBody(event: APIGatewayProxyEventV2, paramName: string): JplBody {
    const jplBodyString = event.queryStringParameters?.[paramName];
    if (jplBodyString === undefined) {
        throw Error(`Mandatory parameter missing '${paramName}'`);
    }
    const jplBody = jplBodyFromString(jplBodyString);
    if (jplBody === undefined) {
        throw Error(`Cannot find JplBody for '${paramName}'`);
    }
    return jplBody;
}