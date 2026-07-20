import { describe, expect, it } from 'vitest';
import { civilDaySpan, parseCivilDate } from './CivilDays';

describe('civilDaySpan', () => {
  it('generates every civil day with a continuous span', () => {
    const span = civilDaySpan(parseCivilDate('2026-01-01'), parseCivilDate('2026-01-03'), 'Europe/Warsaw');

    expect(span.days.map(day => day.key)).toEqual(['2026-01-01', '2026-01-02', '2026-01-03']);
    expect(span.fromEs).toBe(span.days[0].startEs);
    expect(span.toEs - span.days[2].startEs).toBe(86_400);
  });

  it('handles daylight-saving day lengths', () => {
    const springForward = civilDaySpan(parseCivilDate('2026-03-29'), parseCivilDate('2026-03-29'), 'Europe/Warsaw');
    const fallBack = civilDaySpan(parseCivilDate('2026-10-25'), parseCivilDate('2026-10-25'), 'Europe/Warsaw');

    expect(springForward.toEs - springForward.fromEs).toBe(23 * 3600);
    expect(fallBack.toEs - fallBack.fromEs).toBe(25 * 3600);
  });
});