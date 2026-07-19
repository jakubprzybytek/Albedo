import type { APIGatewayProxyEvent } from 'aws-lambda';
import { addDays, addYears, isAfter } from 'date-fns';
import { getTimezoneOffset, toZonedTime } from 'date-fns-tz';
import { EphemerisSeconds } from '@jpl';
import {
  ALTITUDE_TARGET_NAMES,
  ALTITUDE_TARGETS,
  Visibility,
  type AltitudeTarget,
  type AltitudeTargetName,
  type ObjectEvents,
  type SolarEventAtEphemerisSecond,
} from '@astro/scripts';
import { kernels } from '@jpl/data/kernels.full';
import { Failure, lambdaHandler, Success } from '../HandlerProxy';
import { mandatoryString } from '../LambdaParams';
import { assertTimeZone, civilDayIntervals, formatCivilDate, parseCivilDate } from './CivilDays';

const VISIBILITY_PAGE_DAYS = 93;

type VisibilityCursor = { version: 1; nextDate: string; query: string };

export type GetVisibilityParams = {
  targets: AltitudeTarget[];
  fromDate: Date;
  toDate: Date;
  timeZone: string;
  latitude: number;
  longitude: number;
  altitude: number;
  cursor: string | undefined;
};

export type VisibilityEventDto = { tde: string; minuteOfDay: number; utcOffsetMinutes: number };
export type VisibilityTransitDto = VisibilityEventDto & { altitude: number };
export type VisibilityObjectDayDto = { rise: VisibilityEventDto | null; transit: VisibilityTransitDto | null; set: VisibilityEventDto | null };
export type VisibilityResponse = {
  timeZone: string;
  fromDate: string;
  toDate: string;
  days: { date: string; objects: Partial<Record<AltitudeTargetName, VisibilityObjectDayDto>>; solar: { phaseAtStart: string; events: (VisibilityEventDto & { type: string })[] } }[];
  nextCursor: string | null;
};

function mandatoryFiniteNumber(event: APIGatewayProxyEvent, name: string): number {
  const value = Number(mandatoryString(event, name));
  if (!Number.isFinite(value)) throw new Error(`Parameter '${name}' must be a finite number`);
  return value;
}

function parseTargets(value: string): AltitudeTarget[] {
  const names = value.split(',').map(name => name.trim());
  if (!names.length || names.some(name => !name)) throw new Error("Parameter 'targets' must contain at least one supported target");
  if (new Set(names).size !== names.length) throw new Error("Parameter 'targets' must not contain duplicates");
  return names.map(name => {
    if (!ALTITUDE_TARGET_NAMES.includes(name as AltitudeTargetName)) throw new Error(`Unsupported altitude target '${name}'`);
    return ALTITUDE_TARGETS.find(target => target.name === name)!;
  });
}

export function parseGetVisibilityParams(event: APIGatewayProxyEvent): GetVisibilityParams {
  const fromDate = parseCivilDate(mandatoryString(event, 'fromDate'));
  const toDate = parseCivilDate(mandatoryString(event, 'toDate'));
  const timeZone = mandatoryString(event, 'timeZone');
  assertTimeZone(timeZone);
  const latitude = mandatoryFiniteNumber(event, 'latitude');
  const longitude = mandatoryFiniteNumber(event, 'longitude');
  const altitude = mandatoryFiniteNumber(event, 'altitude');
  if (isAfter(fromDate, toDate)) throw new Error("Parameter 'fromDate' must not be after 'toDate'");
  if (!isAfter(addYears(fromDate, 10), toDate)) throw new Error('Requested range must be shorter than ten calendar years');
  if (latitude < -90 || latitude > 90) throw new Error("Parameter 'latitude' must be between -90 and 90");
  if (longitude < -180 || longitude > 180) throw new Error("Parameter 'longitude' must be between -180 and 180");
  if (altitude < 0) throw new Error("Parameter 'altitude' must be greater than or equal to 0");
  return { targets: parseTargets(mandatoryString(event, 'targets')), fromDate, toDate, timeZone, latitude, longitude, altitude, cursor: event.queryStringParameters?.cursor ?? undefined };
}

function queryKey(params: GetVisibilityParams): string {
  return JSON.stringify({
    targets: params.targets.map(target => target.name), fromDate: formatCivilDate(params.fromDate), toDate: formatCivilDate(params.toDate),
    timeZone: params.timeZone, latitude: params.latitude, longitude: params.longitude, altitude: params.altitude,
  });
}

function decodeCursor(value: string, expectedQuery: string, fromDate: Date, toDate: Date): Date {
  let cursor: VisibilityCursor;
  try {
    cursor = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as VisibilityCursor;
  } catch {
    throw new Error("Parameter 'cursor' is invalid");
  }
  if (cursor.version !== 1 || cursor.query !== expectedQuery) throw new Error("Parameter 'cursor' does not match this query");
  const date = parseCivilDate(cursor.nextDate);
  if (isAfter(fromDate, date) || isAfter(date, toDate)) throw new Error("Parameter 'cursor' is outside the requested date range");
  return date;
}

function encodeCursor(nextDate: Date, query: string): string {
  return Buffer.from(JSON.stringify({ version: 1, nextDate: formatCivilDate(nextDate), query } satisfies VisibilityCursor)).toString('base64url');
}

function eventDto(es: number, timeZone: string): VisibilityEventDto {
  const instant = EphemerisSeconds.toDateObject(es);
  const zoned = toZonedTime(instant, timeZone);
  return {
    tde: instant.toISOString(),
    minuteOfDay: zoned.getHours() * 60 + zoned.getMinutes() + zoned.getSeconds() / 60,
    utcOffsetMinutes: getTimezoneOffset(timeZone, instant) / 60_000,
  };
}

function objectDto(events: ObjectEvents, timeZone: string): VisibilityObjectDayDto {
  return {
    rise: events.rise && eventDto(events.rise.es, timeZone),
    transit: events.transit && { ...eventDto(events.transit.es, timeZone), altitude: events.transit.altitude },
    set: events.set && eventDto(events.set.es, timeZone),
  };
}

function solarDto(events: readonly SolarEventAtEphemerisSecond[], timeZone: string) {
  return events.map(event => ({ type: event.type, ...eventDto(event.es, timeZone) }));
}

export function getVisibility(event: APIGatewayProxyEvent) {
  let params: GetVisibilityParams;
  try {
    params = parseGetVisibilityParams(event);
  } catch (error) {
    return Failure(error instanceof Error ? error.message : String(error));
  }
  const query = queryKey(params);
  let pageFrom: Date;
  try {
    pageFrom = params.cursor ? decodeCursor(params.cursor, query, params.fromDate, params.toDate) : params.fromDate;
  } catch (error) {
    return Failure(error instanceof Error ? error.message : String(error));
  }
  const pageToCandidate = addDays(pageFrom, VISIBILITY_PAGE_DAYS - 1);
  const pageTo = isAfter(pageToCandidate, params.toDate) ? params.toDate : pageToCandidate;
  const results = new Visibility(kernels).compute(params.targets, civilDayIntervals(pageFrom, pageTo, params.timeZone), {
    latitude: params.latitude, longitude: params.longitude, altitude: params.altitude,
  });
  const nextDate = addDays(pageTo, 1);
  return Success<VisibilityResponse>({
    timeZone: params.timeZone,
    fromDate: formatCivilDate(params.fromDate),
    toDate: formatCivilDate(params.toDate),
    days: results.map(result => ({
      date: result.key,
      objects: Object.fromEntries(params.targets.map(target => [target.name, objectDto(result.objects[target.name]!, params.timeZone)])),
      solar: { phaseAtStart: result.solar.phaseAtStart, events: solarDto(result.solar.events, params.timeZone) },
    })),
    nextCursor: isAfter(nextDate, params.toDate) ? null : encodeCursor(nextDate, query),
  });
}

export const handler = lambdaHandler<VisibilityResponse>(getVisibility);