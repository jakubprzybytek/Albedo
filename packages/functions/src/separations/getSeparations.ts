import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody, optionalFloat } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Separation, Separations } from '@astro/scripts';
import { JplBody } from '@jpl';
import { kernels } from "@jpl/data/kernels.full";
import { ObserverLocation } from "@astro/coords";

type GetSeparationsParams = {
    target: JplBody;
    observer: JplBody;
    fromTde: Date;
    toTde: Date;
    interval: number;
    longitude: number | undefined;
    latitude: number | undefined;
    altitude: number | undefined;
}

const parseGetSeparationsParams: (event: APIGatewayProxyEventV2) => GetSeparationsParams = (event: APIGatewayProxyEventV2) => ({
    target: mandatoryJplBody(event, 'target'),
    observer: mandatoryJplBody(event, 'observer'),
    fromTde: mandatoryDate(event, 'fromTde'),
    toTde: mandatoryDate(event, 'toTde'),
    interval: mandatoryFloat(event, 'interval'),
    longitude: optionalFloat(event, 'longitude'),
    latitude: optionalFloat(event, 'latitude'),
    altitude: optionalFloat(event, 'altitude'),
});

export const handler = lambdaHandler<Separation[]>(event => {
    const { target, observer, fromTde, toTde, interval, longitude, latitude, altitude } = parseGetSeparationsParams(event);

    const fromJde = JulianDay.fromDateTimeObject(fromTde);
    const toJde = JulianDay.fromDateTimeObject(toTde);

    const observerLocation: ObserverLocation | undefined = longitude && latitude && altitude ? {
        latitude,
        longitude,
        altitude
    } : undefined;

    console.log(`Compute separations for '${target.name}' w.r.t. '${observer.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s)`
        + (observerLocation ? ` for observer at ${observerLocation.latitude}°, ${observerLocation.longitude}°, ${observerLocation.altitude}m` : ''));

    const seprationScripts = new Separations(kernels);
    const separations = seprationScripts.for(target.id, observer.id, fromJde, toJde, interval, observerLocation);

    console.log(`Computed ${separations.length} separations`);

    return Success(separations);
});
