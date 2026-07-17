import { Radians } from '@astro/coords';
import type { ObserverLocation } from '@astro/coords';
import { JplBodyId } from '@jpl';
import type { KernelsRepository } from '@jpl/kernels';
import { Ephemerides } from '../ephemeris';
import { findSolarEvents, type SolarEventType } from './SolarEvents';

export const ALTITUDE_TARGET_NAMES = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
] as const;

export type AltitudeTargetName = typeof ALTITUDE_TARGET_NAMES[number];

export type AltitudeTarget = {
  name: AltitudeTargetName;
  bodyId: JplBodyId;
};

export const ALTITUDE_TARGETS: readonly AltitudeTarget[] = [
  { name: 'Sun', bodyId: JplBodyId.Sun },
  { name: 'Moon', bodyId: JplBodyId.Moon },
  { name: 'Mercury', bodyId: JplBodyId.Mercury },
  { name: 'Venus', bodyId: JplBodyId.Venus },
  { name: 'Mars', bodyId: JplBodyId.Mars },
  { name: 'Jupiter', bodyId: JplBodyId.Jupiter },
  { name: 'Saturn', bodyId: JplBodyId.Saturn },
  { name: 'Uranus', bodyId: JplBodyId.Uranus },
  { name: 'Neptune', bodyId: JplBodyId.Neptune },
] as const;

export type AltitudeSample = {
  tde: Date;
  altitudes: Record<AltitudeTargetName, number>;
};

export type SolarEvent = {
  type: SolarEventType;
  tde: Date;
};

export type AltitudesResult = {
  samples: AltitudeSample[];
  solarEvents: SolarEvent[];
};

const SAMPLE_INTERVAL_SECONDS = 600;

function sampleTimes(fromEs: number, toEs: number): number[] {
  const times: number[] = [];
  for (let es = fromEs; es < toEs; es += SAMPLE_INTERVAL_SECONDS) {
    times.push(es);
  }
  if (times.at(-1) !== toEs) {
    times.push(toEs);
  }
  return times;
}

function dateFromEphemerisSeconds(es: number): Date {
  return new Date(Date.UTC(2000, 0, 1, 12) + Math.round(es * 1000));
}

export class Altitudes {
  constructor(private readonly kernels: KernelsRepository) {
  }

  compute(
    targets: readonly AltitudeTarget[],
    fromEs: number,
    toEs: number,
    observer: ObserverLocation,
  ): AltitudesResult {
    if (!Number.isFinite(fromEs) || !Number.isFinite(toEs) || fromEs >= toEs) {
      throw new Error('Altitude calculation requires finite bounds with fromEs before toEs');
    }
    if (targets.length === 0) {
      throw new Error('Altitude calculation requires at least one target');
    }
    if (new Set(targets.map(target => target.name)).size !== targets.length) {
      throw new Error('Altitude calculation targets must be unique');
    }

    const ephemerides = new Ephemerides(this.kernels);
    const coordinateFunctions = new Map(targets.map(target => [
      target.name,
      ephemerides.buildFullCoordinatesFunction(target.bodyId, observer),
    ]));
    const sunFunction = coordinateFunctions.get('Sun')
      ?? ephemerides.buildFullCoordinatesFunction(JplBodyId.Sun, observer);
    const times = sampleTimes(fromEs, toEs);
    const samples = times.map(es => {
      const altitudes = {} as Record<AltitudeTargetName, number>;
      for (const target of targets) {
        const coordinateFunction = coordinateFunctions.get(target.name);
        if (!coordinateFunction) {
          throw new Error(`Missing altitude coordinate function for '${target.name}'`);
        }
        altitudes[target.name] = Radians.toDegrees(coordinateFunction(es).azAltCoords.altitude);
      }
      return { tde: dateFromEphemerisSeconds(es), altitudes };
    });

    const solarEvents = findSolarEvents(
      times,
      es => Radians.toDegrees(sunFunction(es).azAltCoords.altitude),
    ).map(event => ({ type: event.type, tde: dateFromEphemerisSeconds(event.es) }));

    return { samples, solarEvents };
  }
}