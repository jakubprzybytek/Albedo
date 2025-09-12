import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate, optionalFloat } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Eclipses, Eclipse } from '@astro/scripts';
import { kernels } from "@jpl/data/kernels.full";
import { ObserverLocation } from "@astro/coords";

type GetEclipsesParams = {
  fromTde: Date;
  toTde: Date;
  longitude: number | undefined;
  latitude: number | undefined;
  altitude: number | undefined;
}

const parseGetEcilipsesParams: (event: APIGatewayProxyEventV2) => GetEclipsesParams = (event: APIGatewayProxyEventV2) => ({
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  longitude: optionalFloat(event, 'longitude'),
  latitude: optionalFloat(event, 'latitude'),
  altitude: optionalFloat(event, 'altitude'),
});

export type GetEclipsesReturnType = Eclipse[];

export const handler = lambdaHandler<GetEclipsesReturnType>(event => {
  const { fromTde, toTde, longitude, latitude, altitude } = parseGetEcilipsesParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const eclipseScripts = new Eclipses(kernels);
  const observerLocation: ObserverLocation | undefined = longitude && latitude && altitude ? {
    longitude,
    latitude,
    altitude
  } : undefined;

  console.log(`Find eclipses between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})` +
    (observerLocation ? ` for observer at ${observerLocation.longitude}°, ${observerLocation.latitude}°, ${observerLocation.altitude}m` : ''));

  const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde, observerLocation);

  console.log(`Found ${eclipses.length} eclipses.`);

  return Success(eclipses);
});
