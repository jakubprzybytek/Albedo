import { readFileSync } from 'fs';
import { OpenNgcObject, OpenNgcObjectType } from '.';
import { object } from 'zod';

// degree
export function parseAngle(angleString: string): number {
  const values = angleString.split(':');
  const angles = Number(values[0]);
  return angles >= 0
    ? angles + Number(values[1]) / 60 + Number(values[2]) / 3600
    : angles - Number(values[1]) / 60 - Number(values[2]) / 3600;
}

export function parseObject(line: string): OpenNgcObject {
  const columns = line.split(';');

  try {

    return {
      name: columns[0],
      // type: objectType,
      type: columns[1] as OpenNgcObjectType,
      rightAscensionDec: parseAngle(columns[2]) * 15.0,
      declinationDec: parseAngle(columns[3]),
      majorAxis: Number(columns[5]),
      minorAxis: Number(columns[6]),
      positionAngleDec: Number(columns[7])
    }
  } catch (e: unknown) {
    console.error(`Cannot parse: '${line}'`, e);
    throw e;
  }
}

export function loadOpenNgc(fileName: string): OpenNgcObject[] {
  const content = readFileSync(fileName, 'utf8');
  return content
    .split(/\r?\n/)
    .slice(1)
    .filter(line => line.length > 20)
    .map(parseObject)
    .filter(object => object.type != OpenNgcObjectType.NonExisting);
}
