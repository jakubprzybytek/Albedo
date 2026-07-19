import { Radians, type ObserverLocation } from '@astro/coords';
import { JplBodyId } from '@jpl';
import type { KernelsRepository } from '@jpl/kernels';
import { Ephemerides } from '../ephemeris';
import { findSolarEvents, solarPhaseAt, type AltitudeTarget, type AltitudeTargetName } from '../altitudes';
import { findObjectEvents, sampleVisibilityTimes } from './ObjectEvents';
import type { VisibilityInterval, VisibilityIntervalResult } from './visibilityTypes';

export class Visibility {
  constructor(private readonly kernels: KernelsRepository) {}

  compute(
    targets: readonly AltitudeTarget[],
    intervals: readonly VisibilityInterval[],
    observer: ObserverLocation,
  ): VisibilityIntervalResult[] {
    if (targets.length === 0 || new Set(targets.map(target => target.name)).size !== targets.length) {
      throw new Error('Visibility calculation requires unique targets');
    }
    if (intervals.some(interval => !Number.isFinite(interval.fromEs) || !Number.isFinite(interval.toEs) || interval.fromEs >= interval.toEs)) {
      throw new Error('Visibility calculation requires finite intervals with fromEs before toEs');
    }

    const ephemerides = new Ephemerides(this.kernels);
    const altitudes = new Map<AltitudeTargetName, (es: number) => number>();
    for (const target of targets) {
      const coordinates = ephemerides.buildFullCoordinatesFunction(target.bodyId, observer);
      altitudes.set(target.name, es => Radians.toDegrees(coordinates(es).azAltCoords.altitude));
    }
    const sunCoordinates = ephemerides.buildFullCoordinatesFunction(JplBodyId.Sun, observer);
    const sunAltitude = (es: number) => Radians.toDegrees(sunCoordinates(es).azAltCoords.altitude);

    return intervals.map(interval => {
      const times = sampleVisibilityTimes(interval.fromEs, interval.toEs);
      const objects: VisibilityIntervalResult['objects'] = {};
      for (const target of targets) {
        const altitudeAt = altitudes.get(target.name);
        if (!altitudeAt) throw new Error(`Missing coordinate function for '${target.name}'`);
        objects[target.name] = findObjectEvents(times, altitudeAt);
      }
      return {
        key: interval.key,
        objects,
        solar: {
          phaseAtStart: solarPhaseAt(sunAltitude(interval.fromEs)),
          events: findSolarEvents(times, sunAltitude).filter(event => event.es >= interval.fromEs && event.es < interval.toEs),
        },
      };
    });
  }
}