import { APIGatewayProxyEvent } from "aws-lambda";
import { lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryDate, mandatoryFloat } from '../LambdaParams';
import { JulianDay } from '@astro';
import { Conjunctions } from '@astro/scripts';
import { kernels } from "@jpl/data/kernels.full";
import { Conjunction } from ".";
import { ObserverLocation } from "@astro/coords";

type GetConjunctionsParams = {
  fromTde: Date;
  toTde: Date;
  longitude: number;
  latitude: number;
  altitude: number;
}

const parseGetConjunctionsParams: (event: APIGatewayProxyEvent) => GetConjunctionsParams = (event: APIGatewayProxyEvent) => ({
  fromTde: mandatoryDate(event, 'fromTde'),
  toTde: mandatoryDate(event, 'toTde'),
  longitude: mandatoryFloat(event, 'longitude'),
  latitude: mandatoryFloat(event, 'latitude'),
  altitude: mandatoryFloat(event, 'altitude'),
});

export const handler = lambdaHandler<Conjunction[]>(event => {
  const { fromTde, toTde, longitude, latitude, altitude } = parseGetConjunctionsParams(event);

  const fromJde = JulianDay.fromDateObject(fromTde);
  const toJde = JulianDay.fromDateObject(toTde);

  const conjunctionScripts = new Conjunctions(kernels);
  const observerLocation: ObserverLocation = {
    longitude,
    latitude,
    altitude
  };

  console.log(`Compute conjunctions between ${fromTde.toISOString()}(${fromJde}) and ${toTde.toISOString()}(${toJde})` +
    (observerLocation ? ` for observer at ${observerLocation.longitude}°, ${observerLocation.latitude}°, ${observerLocation.altitude}m` : ''));

  const conjunctions = conjunctionScripts.find(fromJde, toJde, observerLocation);

  console.log(`Found ${conjunctions.length} conjunctions.`);

  return Success(conjunctions);
});
