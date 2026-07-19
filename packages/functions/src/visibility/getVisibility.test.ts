import { describe, expect, it } from 'vitest';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { parseGetVisibilityParams } from './getVisibility';

function event(parameters: Record<string, string>): APIGatewayProxyEvent {
  return { queryStringParameters: parameters } as APIGatewayProxyEvent;
}

const valid = { targets: 'Mars,Moon', fromDate: '2026-01-01', toDate: '2035-12-31', timeZone: 'Europe/Warsaw', latitude: '51', longitude: '17', altitude: '50' };

describe('parseGetVisibilityParams', () => {
  it('accepts the largest complete ten-calendar-year range', () => {
    expect(parseGetVisibilityParams(event(valid)).targets.map(target => target.name)).toEqual(['Mars', 'Moon']);
  });

  it.each([
    { ...valid, toDate: '2036-01-01' }, { ...valid, fromDate: '2026-02-30' }, { ...valid, timeZone: 'Not/AZone' },
    { ...valid, targets: 'Mars,Mars' }, { ...valid, latitude: 'Infinity' }, { ...valid, longitude: '181' },
  ])('rejects invalid input %#', parameters => {
    expect(() => parseGetVisibilityParams(event(parameters))).toThrow();
  });
});