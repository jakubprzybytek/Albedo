import type { APIGatewayProxyEvent } from 'aws-lambda';
import { isValid, parseISO } from 'date-fns';
import { EphemerisSeconds } from '@jpl';
import {
  ALTITUDE_TARGET_NAMES,
  ALTITUDE_TARGETS,
  Altitudes,
  type AltitudeTarget,
  type AltitudeTargetName,
  type AltitudesResult,
} from '@astro/scripts';
import { kernels } from '@jpl/data/kernels.full';
import { Failure, lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryString } from '../LambdaParams';

const MAX_RANGE_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export type GetAltitudesParams = {
  targets: AltitudeTarget[];
  fromTde: Date;
  toTde: Date;
  latitude: number;
  longitude: number;
  altitude: number;
};

function mandatoryFiniteNumber(event: APIGatewayProxyEvent, name: string): number {
  const value = Number(mandatoryString(event, name));
  if (!Number.isFinite(value)) {
    throw new Error(`Parameter '${name}' must be a finite number`);
  }
  return value;
}

function mandatoryUtcDate(event: APIGatewayProxyEvent, name: string): Date {
  const value = mandatoryString(event, name);
  if (!value.endsWith('Z')) {
    throw new Error(`Parameter '${name}' must be an ISO 8601 UTC timestamp`);
  }
  const date = parseISO(value);
  if (!isValid(date)) {
    throw new Error(`Parameter '${name}' must be a valid ISO 8601 UTC timestamp`);
  }
  return date;
}

function parseTargets(value: string): AltitudeTarget[] {
  const names = value.split(',').map(name => name.trim());
  if (names.length === 0 || names.some(name => name.length === 0)) {
    throw new Error('Parameter \'targets\' must contain at least one supported target');
  }
  if (new Set(names).size !== names.length) {
    throw new Error("Parameter 'targets' must not contain duplicates");
  }

  return names.map(name => {
    if (!ALTITUDE_TARGET_NAMES.includes(name as AltitudeTargetName)) {
      throw new Error(`Unsupported altitude target '${name}'`);
    }
    const target = ALTITUDE_TARGETS.find(descriptor => descriptor.name === name);
    if (!target) {
      throw new Error(`Unsupported altitude target '${name}'`);
    }
    return target;
  });
}

export function parseGetAltitudesParams(event: APIGatewayProxyEvent): GetAltitudesParams {
  const targets = parseTargets(mandatoryString(event, 'targets'));
  const fromTde = mandatoryUtcDate(event, 'fromTde');
  const toTde = mandatoryUtcDate(event, 'toTde');
  const latitude = mandatoryFiniteNumber(event, 'latitude');
  const longitude = mandatoryFiniteNumber(event, 'longitude');
  const altitude = mandatoryFiniteNumber(event, 'altitude');

  if (latitude < -90 || latitude > 90) {
    throw new Error("Parameter 'latitude' must be between -90 and 90");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Parameter 'longitude' must be between -180 and 180");
  }
  if (altitude < 0) {
    throw new Error("Parameter 'altitude' must be greater than or equal to 0");
  }
  if (fromTde >= toTde) {
    throw new Error("Parameter 'fromTde' must be before 'toTde'");
  }
  if (toTde.getTime() - fromTde.getTime() > MAX_RANGE_MILLISECONDS) {
    throw new Error('Requested range must not exceed 7 days');
  }

  return { targets, fromTde, toTde, latitude, longitude, altitude };
}

export function getAltitudes(event: APIGatewayProxyEvent) {
  let params: GetAltitudesParams;
  try {
    params = parseGetAltitudesParams(event);
  } catch (error) {
    return Failure(error instanceof Error ? error.message : String(error));
  }

  const result = new Altitudes(kernels).compute(
    params.targets,
    EphemerisSeconds.fromDateTimeObject(params.fromTde),
    EphemerisSeconds.fromDateTimeObject(params.toTde),
    { latitude: params.latitude, longitude: params.longitude, altitude: params.altitude },
  );
  return Success<AltitudesResult>(result);
}

export const handler = lambdaHandler<AltitudesResult>(getAltitudes);