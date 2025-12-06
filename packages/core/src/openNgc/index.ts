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

  'Planetary Nebula' = 'PN',

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
  declination: number;
  majorAxis?: number;
  minorAxis?: number;
  positionAngle?: number;
}
