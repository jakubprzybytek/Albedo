import { describe, expect, it } from 'vitest';
import { civilDayIntervals, parseCivilDate } from './CivilDays';

describe('civilDayIntervals', () => {
  it('generates every fifth civil day when requested', () => {
    const intervals = civilDayIntervals(parseCivilDate('2026-01-01'), parseCivilDate('2026-01-12'), 'Europe/Warsaw', 5);

    expect(intervals.map(interval => interval.key)).toEqual(['2026-01-01', '2026-01-06', '2026-01-11']);
  });
});