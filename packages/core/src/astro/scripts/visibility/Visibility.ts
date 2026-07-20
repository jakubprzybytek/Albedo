import { type ObserverLocation } from '@astro/coords';
import { JplBodyId } from '@jpl';
import type { KernelsRepository } from '@jpl/kernels';
import { buildAltitudeFunction, findSolarEvents, memoizeAltitudeAt, solarPhaseAt, type AltitudeTarget } from '../altitudes';
import { findObjectEvents, sampleVisibilityTimes } from './ObjectEvents';
import type { VisibilityResult } from './visibilityTypes';

const SAMPLE_PADDING_SECONDS = 3600;

export class Visibility {
  constructor(private readonly kernels: KernelsRepository) {}

  compute(
    targets: readonly AltitudeTarget[],
    fromEs: number,
    toEs: number,
    phaseTimes: readonly number[],
    observer: ObserverLocation,
  ): VisibilityResult {
    if (targets.length === 0 || new Set(targets.map(target => target.name)).size !== targets.length) {
      throw new Error('Visibility calculation requires unique targets');
    }
    if (!Number.isFinite(fromEs) || !Number.isFinite(toEs) || fromEs >= toEs) {
      throw new Error('Visibility calculation requires a finite range with fromEs before toEs');
    }
    if (phaseTimes.some(es => !Number.isFinite(es) || es < fromEs || es >= toEs)) {
      throw new Error('Visibility calculation requires finite phase times within the requested range');
    }

    // Sample one step beyond both range boundaries so events near the edges are properly
    // bracketed, then keep only events inside the half-open [fromEs, toEs) range.
    const times = sampleVisibilityTimes(fromEs - SAMPLE_PADDING_SECONDS, toEs + SAMPLE_PADDING_SECONDS);
    const inRange = (es: number) => es >= fromEs && es < toEs;

    const objects: VisibilityResult['objects'] = {};
    for (const target of targets) {
      const altitudeAt = buildAltitudeFunction(this.kernels, target.bodyId, observer);
      objects[target.name] = findObjectEvents(times, altitudeAt).filter(event => inRange(event.es));
    }

    const sunAltitudeAt = memoizeAltitudeAt(buildAltitudeFunction(this.kernels, JplBodyId.Sun, observer));
    return {
      objects,
      solar: {
        events: findSolarEvents(times, sunAltitudeAt).filter(event => inRange(event.es)),
        phases: phaseTimes.map(es => ({ es, phase: solarPhaseAt(sunAltitudeAt(es)) })),
      },
    };
  }
}