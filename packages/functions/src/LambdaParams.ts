import { APIGatewayProxyEvent } from "aws-lambda";
import { JplBody, jplBodyFromString } from '@jpl';
import { parseISO } from 'date-fns';

export function mandatoryString(event: APIGatewayProxyEvent, paramName: string): string {
    const stringValue = event.queryStringParameters?.[paramName];
    if (stringValue === undefined) {
        throw Error(`Mandatory parameter is missing: ${paramName}`);
    }
    return stringValue;
}

export function mandatoryFloat(event: APIGatewayProxyEvent, paramName: string): number {
    const numberString = event.queryStringParameters?.[paramName];
    if (numberString === undefined) {
        throw Error(`Mandatory parameter is missing: ${paramName}`);
    }
    return Number.parseFloat(numberString);
}

export function optionalFloat(event: APIGatewayProxyEvent, paramName: string): number | undefined {
    const numberString = event.queryStringParameters?.[paramName];
    return numberString ? Number.parseFloat(numberString) : undefined;
}

export function mandatoryDate(event: APIGatewayProxyEvent, paramName: string): Date {
    const dateString = event.queryStringParameters?.[paramName];
    if (dateString === undefined) {
        throw Error(`Mandatory parameter missing '${paramName}'`);
    }
    // return parse(dateString, "yyyy-MM-dd'T'HH:mm", new Date());
    return parseISO(dateString);
}

export function mandatoryJplBody(event: APIGatewayProxyEvent, paramName: string): JplBody {
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