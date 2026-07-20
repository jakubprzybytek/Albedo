import { findLocalMinimumByGoldenSection } from '@astro/math/extremums/findLocalMinimumByGoldenSection';
import { findThresholdCrossings, memoizeAltitudeAt, type AltitudeAt } from '../altitudes';
import type { ObjectEvent } from './visibilityTypes';

const MAX_BRACKET_SECONDS = 60;

export function sampleVisibilityTimes(fromEs: number, toEs: number, intervalSeconds = 3600): number[] {
  const times: number[] = [];
  for (let es = fromEs; es < toEs; es += intervalSeconds) times.push(es);
  if (times.at(-1) !== toEs) times.push(toEs);
  return times;
}

export function findObjectEvents(sampleTimes: readonly number[], altitudeAt: AltitudeAt): ObjectEvent[] {
  const cachedAltitudeAt = memoizeAltitudeAt(altitudeAt);
  const events: ObjectEvent[] = findThresholdCrossings(sampleTimes, cachedAltitudeAt, 0)
    .map(crossing => ({ type: crossing.direction === 'rising' ? 'rise' : 'set', es: crossing.es }));

  for (let index = 1; index < sampleTimes.length - 1; index += 1) {
    const before = cachedAltitudeAt(sampleTimes[index - 1]);
    const current = cachedAltitudeAt(sampleTimes[index]);
    const after = cachedAltitudeAt(sampleTimes[index + 1]);
    if (current <= before || current <= after) continue;
    const [es, negativeAltitude] = findLocalMinimumByGoldenSection(
      value => -cachedAltitudeAt(value),
      sampleTimes[index - 1], sampleTimes[index], sampleTimes[index + 1],
      { maxResultRangeWidth: MAX_BRACKET_SECONDS, maxIterations: 24 },
    );
    events.push({ type: 'transit', es, altitude: -negativeAltitude });
  }

  return events.sort((first, second) => first.es - second.es);
}