import { addDays, format, isValid, parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { EphemerisSeconds } from '@jpl';
import type { VisibilityInterval } from '@astro/scripts';

const DATE_FORMAT = 'yyyy-MM-dd';

export function parseCivilDate(value: string): Date {
  const date = parse(value, DATE_FORMAT, new Date(0));
  if (!isValid(date) || format(date, DATE_FORMAT) !== value) {
    throw new Error(`Parameter must be a valid ISO calendar date: '${value}'`);
  }
  return date;
}

export function formatCivilDate(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function assertTimeZone(timeZone: string): void {
  try {
    if (Number.isNaN(fromZonedTime('2026-01-01T00:00:00', timeZone).getTime())) {
      throw new Error('Invalid time zone');
    }
  } catch {
    throw new Error(`Parameter 'timeZone' must be a valid IANA time-zone identifier`);
  }
}

export function civilDayIntervals(fromDate: Date, toDate: Date, timeZone: string): VisibilityInterval[] {
  const intervals: VisibilityInterval[] = [];
  for (let date = fromDate; date <= toDate; date = addDays(date, 1)) {
    const key = formatCivilDate(date);
    const followingKey = formatCivilDate(addDays(date, 1));
    const from = fromZonedTime(`${key}T00:00:00`, timeZone);
    const to = fromZonedTime(`${followingKey}T00:00:00`, timeZone);
    intervals.push({
      key,
      fromEs: EphemerisSeconds.fromDateTimeObject(from),
      toEs: EphemerisSeconds.fromDateTimeObject(to),
    });
  }
  return intervals;
}