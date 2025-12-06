export enum OpenNgcObjectType {
  Unknown = '**',
  NonExisting = 'NonEx',
  Duplicate = 'Dup',

  Galaxy = 'G',
  'Galaxy Group' = 'GGroup',
  'Galaxy Pair' = 'GPair',
  'Galaxy Triplet' = 'Gtrpl',

  'Open Cluster' = 'OCl',
  'Closed Cluster' = 'GCl',
  Assotiation = '*Ass',
  'Cluser and Nebula' = 'Cl+N',

  'Hydrogen Nebula' = 'HII',
  Nebula = 'Neb',
  'Emission Nebula' = 'EmN',
  'Reflection Nebula' = 'RfN',
  'Supernova Remnant Nebula' = 'SNR',
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
