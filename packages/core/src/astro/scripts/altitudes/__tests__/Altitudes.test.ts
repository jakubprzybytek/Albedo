import { describe, expect, it } from 'vitest';
import { Altitudes, ALTITUDE_TARGETS } from '..';
import { kernels } from '@jpl/data/kernels.testData';

describe('Altitudes', () => {
  it('includes aligned endpoints and requested target keys', () => {
    const result = new Altitudes(kernels).compute(
      [ALTITUDE_TARGETS[0], ALTITUDE_TARGETS[2]],
      623937600,
      623938800,
      { latitude: 52, longitude: 17, altitude: 50 },
    );

    expect(result.samples).toHaveLength(3);
    expect(result.samples.map(sample => sample.tde.toISOString())).toEqual([
      '2019-10-10T00:00:00.000Z',
      '2019-10-10T00:10:00.000Z',
      '2019-10-10T00:20:00.000Z',
    ]);
    expect(Object.keys(result.samples[0].altitudes)).toEqual(['Moon', 'Venus']);
    expect(result.samples[0].altitudes.Venus).toBeGreaterThanOrEqual(-90);
    expect(result.samples[0].altitudes.Venus).toBeLessThanOrEqual(90);
  });

  it('appends a final sample when the endpoint is not aligned', () => {
    const result = new Altitudes(kernels).compute(
      [ALTITUDE_TARGETS[0]],
      623937600,
      623938650,
      { latitude: 52, longitude: 17, altitude: 50 },
    );

    expect(result.samples).toHaveLength(3);
    expect(result.samples.at(-1)?.tde.toISOString()).toBe('2019-10-10T00:17:30.000Z');
  });
});