import openNgcObjectsRaw from './data/generated/openNgcObjects.full.json';

export enum OpenNgcObjectType {
  Unknown = '**',
  NonExisting = 'NonEx',
  Duplicate = 'Dup',
  Galaxy = 'G',
  OpenCluster = 'OCl'
}

export type OpenNgcObject = {
  name: string;
  type: OpenNgcObjectType;
  rightAscension: number;
  rightAscensionDeg: number;
  declination: number;
  declinationDeg: number;
  majorAxis: number;
  minorAxis: number;
  positionAngle: number;
  positionAngleDeg: number;
}

const openNgcObjects = openNgcObjectsRaw as OpenNgcObject[];

export { openNgcObjects };
