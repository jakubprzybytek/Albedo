export enum OpenNgcObjectType {
  Unknown = '**',
  NonExisting = 'NonEx',
  Duplicate = 'Dup',
  Galaxy = 'G',
}

export type OpenNgcObject = {
  name: string;
  type: OpenNgcObjectType;
  rightAscensionDec: number;
  declinationDec: number;
  majorAxis: number;
  minorAxis: number;
  positionAngleDec: number;
}
