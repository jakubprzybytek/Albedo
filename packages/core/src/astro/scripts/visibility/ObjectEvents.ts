import { findLocalMinimumByGoldenSection } from '@astro/math/extremums/findLocalMinimumByGoldenSection';
import { findThresholdCrossings, type AltitudeAt } from '../altitudes';
import type { ObjectEvents } from './visibilityTypes';

const MAX_BRACKET_SECONDS = 60;

export function sampleVisibilityTimes(fromEs: number, toEs: number, intervalSeconds = 3600): number[] {
  const times: number[] = [];
  for (let es = fromEs; es < toEs; es += intervalSeconds) times.push(es);
  if (times.at(-1) !== toEs) times.push(toEs);
  return times;
}

export function findObjectEvents(sampleTimes: readonly number[], altitudeAt: AltitudeAt): ObjectEvents {
  const crossings = findThresholdCrossings(sampleTimes, altitudeAt, 0);
  const rise = crossings.find(event => event.direction === 'rising') ?? null;
  const set = crossings.find(event => event.direction === 'setting') ?? null;
  const maxima: { es: number; altitude: number }[] = [];

  for (let index = 1; index < sampleTimes.length - 1; index += 1) {
    const before = altitudeAt(sampleTimes[index - 1]);
    const current = altitudeAt(sampleTimes[index]);
    const after = altitudeAt(sampleTimes[index + 1]);
    if (current <= before || current <= after) continue;
    const [es, negativeAltitude] = findLocalMinimumByGoldenSection(
      value => -altitudeAt(value),
      sampleTimes[index - 1], sampleTimes[index], sampleTimes[index + 1],
      { maxResultRangeWidth: MAX_BRACKET_SECONDS, maxIterations: 24 },
    );
    maxima.push({ es, altitude: -negativeAltitude });
  }

  const transit = maxima.sort((first, second) => second.altitude - first.altitude || first.es - second.es)[0] ?? null;
  return { rise, transit, set };
}