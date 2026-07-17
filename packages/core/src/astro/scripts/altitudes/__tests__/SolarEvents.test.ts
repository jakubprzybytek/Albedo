import { describe, expect, it } from 'vitest';
import { findSolarEvents } from '..';

describe('findSolarEvents', () => {
  it('detects rising and setting crossings for every threshold', () => {
    const rising = findSolarEvents([0, 600], es => -20 + es / 30);
    const setting = findSolarEvents([0, 600], es => 20 - es / 15);

    expect(rising.map(event => event.type)).toEqual([
      'astronomicalDawn', 'nauticalDawn', 'civilDawn', 'sunrise',
    ]);
    expect(setting.map(event => event.type)).toEqual([
      'sunset', 'civilDusk', 'nauticalDusk', 'astronomicalDusk',
    ]);
    expect(rising.every(event => Math.abs(event.es - (event.type === 'sunrise' ? 575.01 : event.es)) <= 60)).toBe(true);
  });

  it('does not report tangents or constant-altitude periods', () => {
    expect(findSolarEvents([0, 600, 1200], es => (es - 600) ** 2 / 10_000_000 - 6)).toEqual([]);
    expect(findSolarEvents([0, 600], () => 10)).toEqual([]);
  });

  it('owns an exact threshold sample once', () => {
    const events = findSolarEvents([500, 600, 700], es => -6 + (es - 600) / 100);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('civilDawn');
    expect(events[0].es).toBeCloseTo(600, 0);
  });
});