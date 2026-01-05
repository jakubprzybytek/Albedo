import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate, mandatoryFloat } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Eclipses, Eclipse } from '@astro/scripts';
import { kernels } from "@jpl/data/kernels.full";
import { ObserverLocation } from "@astro/coords";

type GetEclipsesParams = {
  fromTde: Date;
  toTde: Date;
  latitude: number;
  longitude: number;
  altitude: number;
}

const parseGetEcilipsesParams: (event: APIGatewayProxyEventV2) => GetEclipsesParams = (event: APIGatewayProxyEventV2) => ({
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  latitude: mandatoryFloat(event, 'latitude'),
  longitude: mandatoryFloat(event, 'longitude'),
  altitude: mandatoryFloat(event, 'altitude'),
});

export type GetEclipsesReturnType = Eclipse[];

export const handler = lambdaHandler<GetEclipsesReturnType>(event => {
  const { fromTde, toTde, longitude, latitude, altitude } = parseGetEcilipsesParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const observerLocation: ObserverLocation = {
    longitude,
    latitude,
    altitude
  };

  console.log(`Find eclipses between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})` +
    ` for observer at ${observerLocation.longitude}°, ${observerLocation.latitude}°, ${observerLocation.altitude}m`);

  const eclipseScripts = new Eclipses(kernels);
  const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde, observerLocation);
  console.log(`Found ${eclipses.length} eclipses.`);

  return Success(eclipses);
});
