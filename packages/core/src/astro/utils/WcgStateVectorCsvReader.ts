// open csv file
import { JulianDay } from '@astro/JulianDay';
import { EphemerisSeconds } from '@jpl';
import { readFileSync } from 'fs';

export type StateRow = {
  es: number;
  x: number;
  y: number;
  z: number;
}

export function parseTdeAsJde(tdeString: string): number {
  const tdeDate = new Date(tdeString.replaceAll('"', '').replace(' TDB', 'Z').replace(' ', 'T'));
  return JulianDay.fromDateTimeObject(tdeDate);
}

export function parseTdeAsEs(tdeString: string): number {
  const tdeDate = new Date(tdeString.replaceAll('"', '').replace(' TDB', 'Z').replace(' ', 'T'));
  return EphemerisSeconds.fromDateTimeObject(tdeDate);
}

export function parseStateRow(line: string): StateRow {
  const values = line.split(',');
  if (values.length < 4) {
    throw new Error('Invalid state row format');
  }

  return {
    es: parseTdeAsEs(values[0]),
    x: parseFloat(values[3]),
    y: parseFloat(values[4]),
    z: parseFloat(values[5]),
  };
}

export function loadWcgSTateVectorCsv(fileName: string): StateRow[] {
  const fileContent = readFileSync(fileName, 'utf-8');
  const lines = fileContent.split('\n');

  return lines
    .filter(line => line.length > 160)
    .map(parseStateRow);
}
