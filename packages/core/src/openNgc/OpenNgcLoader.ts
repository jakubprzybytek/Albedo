import { readFileSync } from 'fs';
import { OpenNgcObject, OpenNgcObjectType } from '.';
import { Radians } from '@astro/coords';

export function parseAngleInDegree(angleString: string): number {
  const values = angleString.split(':');
  const angles = Number(values[0]);
  return angles >= 0
    ? angles + Number(values[1]) / 60 + Number(values[2]) / 3600
    : angles - Number(values[1]) / 60 - Number(values[2]) / 3600;
}

export function parseAngleInArcMinutes(angleString: string): number | undefined {
  return angleString.length > 0 ? Number(angleString) / 60 : undefined;
}

export function parseObject(line: string): OpenNgcObject {
  const columns = line.split(';');

  try {
    const majorAxisDeg = parseAngleInArcMinutes(columns[5]);
    const minorAxisDeg = parseAngleInArcMinutes(columns[6]);
    const positionAngleDeg = columns[7].length > 0 ? Number(columns[7]) : undefined;

    return {
      name: columns[0],
      type: columns[1] as OpenNgcObjectType,
      rightAscension: Radians.fromDegrees(parseAngleInDegree(columns[2]) * 15.0),
      declination: Radians.fromDegrees(parseAngleInDegree(columns[3])),
      majorAxis: majorAxisDeg ? Radians.fromDegrees(majorAxisDeg) : undefined,
      minorAxis: minorAxisDeg ? Radians.fromDegrees(minorAxisDeg) : undefined,
      positionAngle: positionAngleDeg ? Radians.fromDegrees(positionAngleDeg) : undefined,
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
