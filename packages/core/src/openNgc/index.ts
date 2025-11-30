export enum OpenNgcObjectType {
  Unknown = '**',
  NonExisting = 'NonEx',
  Duplicate = 'Dup',
  Galaxy = 'G',
}

export type OpenNgcObject = {
  name: string;
  type: OpenNgcObjectType;
  rightAscensionDeg: number;
  declinationDeg: number;
  majorAxis: number;
  minorAxis: number;
  positionAngleDeg: number;
}
