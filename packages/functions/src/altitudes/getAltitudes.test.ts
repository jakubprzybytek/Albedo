import { describe, expect, it } from 'vitest';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { getAltitudes, parseGetAltitudesParams } from './getAltitudes';

function event(parameters: Record<string, string>): APIGatewayProxyEvent {
  return { queryStringParameters: parameters } as APIGatewayProxyEvent;
}

const valid = {
  targets: 'Mars,Moon',
  fromTde: '2026-07-16T20:00:00Z',
  toTde: '2026-07-17T20:00:00Z',
  latitude: '51',
  longitude: '17',
  altitude: '50',
};

describe('parseGetAltitudesParams', () => {
  it('parses an ordered supported target list and UTC coordinates', () => {
    const parsed = parseGetAltitudesParams(event(valid));

    expect(parsed.targets.map(target => target.name)).toEqual(['Mars', 'Moon']);
    expect(parsed.fromTde.toISOString()).toBe('2026-07-16T20:00:00.000Z');
  });

  it.each([
    [{ ...valid, targets: '' }],
    [{ ...valid, targets: 'Mars,Mars' }],
    [{ ...valid, targets: 'mars' }],
    [{ ...valid, fromTde: '2026-07-16T20:00:00' }],
    [{ ...valid, toTde: valid.fromTde }],
    [{ ...valid, toTde: '2026-07-24T20:00:00Z' }],
    [{ ...valid, latitude: 'Infinity' }],
    [{ ...valid, longitude: '181' }],
    [{ ...valid, altitude: '-1' }],
  ])('rejects invalid input %#', parameters => {
    expect(() => parseGetAltitudesParams(event(parameters))).toThrow();
  });
});

describe('getAltitudes', () => {
  it('returns ordered samples with every requested target when the Sun is omitted', () => {
    const result = getAltitudes(event({
      ...valid,
      fromTde: '2026-07-16T20:00:00Z',
      toTde: '2026-07-16T20:20:00Z',
      targets: 'Mars,Moon',
    }));

    expect(result.statusCode).toBe(200);
    if ('samples' in result.data) {
      expect(result.data.samples).toHaveLength(3);
      expect(result.data.samples[0]).toMatchObject({
        tde: expect.any(Date), altitudes: { Mars: expect.any(Number), Moon: expect.any(Number) },
      });
      expect(result.data.samples.at(-1)?.tde.toISOString()).toBe('2026-07-16T20:20:00.000Z');
      expect(result.data.samples.map(sample => Object.keys(sample.altitudes))).toEqual([
        ['Mars', 'Moon'], ['Mars', 'Moon'], ['Mars', 'Moon'],
      ]);
    }
  });
});