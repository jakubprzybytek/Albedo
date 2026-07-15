import { APIGatewayProxyEvent } from "aws-lambda";
import { lambdaHandler, Success, Failure } from '../HandlerProxy';
import { mandatoryFloat, mandatoryDate, mandatoryJplBody } from '../LambdaParams';
import { JulianDay } from '@astro';
import { ObserverLocation } from "@astro/coords";
import { DetailedEphemeris, Ephemerides } from '@astro/scripts';
import { JplBody, JplBodyId } from '@jpl';
import { kernels } from "@jpl/data/kernels.full";

type GetEphemeridesParams = {
  target: JplBody;
  fromTde: Date;
  toTde: Date;
  interval: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

const parseGetEphemerisParams: (event: APIGatewayProxyEvent) => GetEphemeridesParams = (event: APIGatewayProxyEvent) => ({
  target: mandatoryJplBody(event, 'target'),
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  interval: mandatoryFloat(event, 'interval'),
  latitude: mandatoryFloat(event, 'latitude'),
  longitude: mandatoryFloat(event, 'longitude'),
  altitude: mandatoryFloat(event, 'altitude'),
});

export const handler = lambdaHandler<DetailedEphemeris[]>(event => {
  const { target, fromTde, toTde, interval, latitude, longitude, altitude } = parseGetEphemerisParams(event);

  if (target.id === JplBodyId.Earth) {
    return Failure('Cannot compute ephemeris for Earth');
  }

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const observerLocation: ObserverLocation = { longitude, latitude, altitude };

  console.log(`Compute ephemerides for '${target.name}' between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde}) in interval of ${interval} day(s)`
    + ` for observer at ${observerLocation.longitude}°, ${observerLocation.latitude}°, ${observerLocation.altitude}m`);

  const ephemerisScripts = new Ephemerides(kernels);
  const ephemerides = ephemerisScripts.computeFullEphemeridesWithVelocity(target.id, fromJde, toJde, interval, observerLocation);

  return Success(ephemerides);
});
