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

const SOLAR_THRESHOLDS = [
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

export function findSolarEvents(sampleTimes: readonly number[], altitudeAt: AltitudeAt): SolarEventAtEphemerisSecond[] {
  const cache = new Map<number, number>();
  const cachedAltitudeAt = (es: number) => {
    const existing = cache.get(es);
    if (existing !== undefined) {
      return existing;
    }
    const altitude = altitudeAt(es);
    cache.set(es, altitude);
    return altitude;
  };
  const events: SolarEventAtEphemerisSecond[] = [];

  for (const threshold of SOLAR_THRESHOLDS) {
    for (let index = 0; index < sampleTimes.length; index += 1) {
      const current = sampleTimes[index];
      const currentOffset = cachedAltitudeAt(current) - threshold.altitude;
      if (currentOffset !== 0) {
        continue;
      }

      const previousOffset = index > 0
        ? cachedAltitudeAt(sampleTimes[index - 1]) - threshold.altitude
        : undefined;
      const nextOffset = index < sampleTimes.length - 1
        ? cachedAltitudeAt(sampleTimes[index + 1]) - threshold.altitude
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
          type: direction === 'rising' ? threshold.rising : threshold.setting,
          es: current,
        });
      }
    }

    for (let index = 0; index < sampleTimes.length - 1; index += 1) {
      const left = sampleTimes[index];
      const right = sampleTimes[index + 1];
      const leftOffset = cachedAltitudeAt(left) - threshold.altitude;
      const rightOffset = cachedAltitudeAt(right) - threshold.altitude;
      const direction = crossingDirection(leftOffset, rightOffset);
      if (!direction) {
        continue;
      }

      events.push({
        type: direction === 'rising' ? threshold.rising : threshold.setting,
        es: refineCrossing(left, right, threshold.altitude, cachedAltitudeAt),
      });
    }
  }

  return events.sort((first, second) => first.es - second.es || first.type.localeCompare(second.type));
}