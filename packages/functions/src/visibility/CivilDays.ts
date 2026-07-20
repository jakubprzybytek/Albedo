import { addDays, format, isValid, parse } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { EphemerisSeconds } from '@jpl';

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

export type CivilDay = {
  key: string;
  startEs: number;
};

export type CivilDaySpan = {
  fromEs: number;
  toEs: number;
  days: CivilDay[];
};

function civilMidnightEs(date: Date, timeZone: string): number {
  return EphemerisSeconds.fromDateTimeObject(fromZonedTime(`${formatCivilDate(date)}T00:00:00`, timeZone));
}

export function civilDaySpan(fromDate: Date, toDate: Date, timeZone: string): CivilDaySpan {
  const days: CivilDay[] = [];
  for (let date = fromDate; date <= toDate; date = addDays(date, 1)) {
    days.push({ key: formatCivilDate(date), startEs: civilMidnightEs(date, timeZone) });
  }
  return {
    fromEs: days[0].startEs,
    toEs: civilMidnightEs(addDays(toDate, 1), timeZone),
    days,
  };
}