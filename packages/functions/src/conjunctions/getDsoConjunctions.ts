import { APIGatewayProxyEventV2 } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate, optionalFloat } from '../LambdaParams';
import { JulianDay } from '@astro';
import { ObserverLocation } from "@astro/coords";
import { ConjunctionsWithDso, DsoConjunction } from '@astro/scripts';
import { kernels } from "@jpl/data/kernels.full";
import { openNgcObjects } from "@openNgc/data";

type GetConjunctionsParams = {
  fromTde: Date;
  toTde: Date;
  longitude?: number;
  latitude: number | undefined;
  altitude: number | undefined;
}

const parseGetConjunctionsParams: (event: APIGatewayProxyEventV2) => GetConjunctionsParams = (event: APIGatewayProxyEventV2) => ({
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  longitude: optionalFloat(event, 'longitude'),
  latitude: optionalFloat(event, 'latitude'),
  altitude: optionalFloat(event, 'altitude'),
});

export const handler = lambdaHandler<DsoConjunction[]>(event => {
  const { fromTde, toTde, longitude, latitude, altitude } = parseGetConjunctionsParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const conjunctionScripts = new ConjunctionsWithDso(kernels, openNgcObjects);
  const observerLocation: ObserverLocation | undefined = longitude !== undefined && latitude !== undefined && altitude !== undefined ? {
    longitude,
    latitude,
    altitude
  } : undefined;

  console.log(`Compute conjunctions with DSO between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})` +
    (observerLocation ? ` for observer at ${observerLocation.longitude}°, ${observerLocation.latitude}°, ${observerLocation.altitude}m` : ''));

  const conjunctions = conjunctionScripts.findConjunctionsWithDso(fromJde, toJde, observerLocation);

  console.log(`Found ${conjunctions.length} conjunctions.`);

  return Success(conjunctions);
});
