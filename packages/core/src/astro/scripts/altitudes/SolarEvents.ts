export type SolarEventType =
  | 'sunrise'
  | 'sunset'
  | 'civilDawn'
  | 'civilDusk'
  | 'nauticalDawn'
  | 'nauticalDusk'
  | 'astronomicalDawn'
  | 'astronomicalDusk';

export type SolarEventAtEphemerisSecond = {
  type: SolarEventType;
  es: number;
};

export type AltitudeAt = (es: number) => number;

export type SolarPhase = 'day' | 'civilTwilight' | 'nauticalTwilight' | 'astronomicalTwilight' | 'night';

export const SOLAR_THRESHOLDS = [
  { altitude: -0.833, rising: 'sunrise', setting: 'sunset' },
  { altitude: -6, rising: 'civilDawn', setting: 'civilDusk' },
  { altitude: -12, rising: 'nauticalDawn', setting: 'nauticalDusk' },
  { altitude: -18, rising: 'astronomicalDawn', setting: 'astronomicalDusk' },
] as const satisfies readonly {
  altitude: number;
  rising: SolarEventType;
  setting: SolarEventType;
}[];

const MAX_BRACKET_SECONDS = 60;

function crossingDirection(left: number, right: number): 'rising' | 'setting' | undefined {
  if (left < 0 && right > 0) {
    return 'rising';
  }
  if (left > 0 && right < 0) {
    return 'setting';
  }
  return undefined;
}

export function solarPhaseAt(altitude: number): SolarPhase {
  if (altitude >= SOLAR_THRESHOLDS[0].altitude) return 'day';
  if (altitude >= SOLAR_THRESHOLDS[1].altitude) return 'civilTwilight';
  if (altitude >= SOLAR_THRESHOLDS[2].altitude) return 'nauticalTwilight';
  if (altitude >= SOLAR_THRESHOLDS[3].altitude) return 'astronomicalTwilight';
  return 'night';
}

function refineCrossing(
  left: number,
  right: number,
  threshold: number,
  altitudeAt: AltitudeAt,
): number {
  let lower = left;
  let upper = right;
  const lowerOffset = altitudeAt(lower) - threshold;
  const rising = lowerOffset < 0;

  while (upper - lower > MAX_BRACKET_SECONDS) {
    const midpoint = (lower + upper) / 2;
    const midpointOffset = altitudeAt(midpoint) - threshold;
    if ((rising && midpointOffset >= 0) || (!rising && midpointOffset <= 0)) {
      upper = midpoint;
    } else {
      lower = midpoint;
    }
  }

  return (lower + upper) / 2;
}

export function memoizeAltitudeAt(altitudeAt: AltitudeAt): AltitudeAt {
  const cache = new Map<number, number>();
  return (es: number) => {
    const existing = cache.get(es);
    if (existing !== undefined) {
      return existing;
    }
    const altitude = altitudeAt(es);
    cache.set(es, altitude);
    return altitude;
  };
}

export function findSolarEvents(sampleTimes: readonly number[], altitudeAt: AltitudeAt): SolarEventAtEphemerisSecond[] {
  const cachedAltitudeAt = memoizeAltitudeAt(altitudeAt);
  return SOLAR_THRESHOLDS.flatMap(threshold => findThresholdCrossings(sampleTimes, cachedAltitudeAt, threshold.altitude)
    .map(event => ({
      type: event.direction === 'rising' ? threshold.rising : threshold.setting,
      es: event.es,
    })))
    .sort((first, second) => first.es - second.es || first.type.localeCompare(second.type));
}

export type ThresholdCrossing = {
  direction: 'rising' | 'setting';
  es: number;
};

export function findThresholdCrossings(
  sampleTimes: readonly number[],
  altitudeAt: AltitudeAt,
  threshold: number,
): ThresholdCrossing[] {
  // Callers are expected to pass a memoized function (see memoizeAltitudeAt) when the
  // same samples are evaluated across multiple thresholds or event detectors.
  const events: ThresholdCrossing[] = [];

  for (let index = 0; index < sampleTimes.length; index += 1) {
      const current = sampleTimes[index];
      const currentOffset = altitudeAt(current) - threshold;
      if (currentOffset !== 0) {
        continue;
      }

      const previousOffset = index > 0
        ? altitudeAt(sampleTimes[index - 1]) - threshold
        : undefined;
      const nextOffset = index < sampleTimes.length - 1
        ? altitudeAt(sampleTimes[index + 1]) - threshold
        : undefined;
      const direction = previousOffset !== undefined && nextOffset !== undefined
        ? crossingDirection(previousOffset, nextOffset)
        : index === 0 && nextOffset !== undefined
          ? (nextOffset > 0 ? 'rising' : nextOffset < 0 ? 'setting' : undefined)
          : index === sampleTimes.length - 1 && previousOffset !== undefined
            ? (previousOffset < 0 ? 'rising' : previousOffset > 0 ? 'setting' : undefined)
            : undefined;
      if (direction) {
        events.push({
          direction,
          es: current,
        });
      }
    }

    for (let index = 0; index < sampleTimes.length - 1; index += 1) {
      const left = sampleTimes[index];
      const right = sampleTimes[index + 1];
      const leftOffset = altitudeAt(left) - threshold;
      const rightOffset = altitudeAt(right) - threshold;
      const direction = crossingDirection(leftOffset, rightOffset);
      if (!direction) {
        continue;
      }

      events.push({
        direction,
        es: refineCrossing(left, right, threshold, altitudeAt),
      });
    }

  return events.sort((first, second) => first.es - second.es || first.direction.localeCompare(second.direction));
}