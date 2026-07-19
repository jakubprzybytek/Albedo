export * from './states';
export * from './ephemeris';
export * from './altitudes';
export * from './visibility';
export * from './separations';
export * from './conjunctions';
export * from './eclipses';

export * from './utils/time';
export * from './utils/ConjunctionUtils';

export type TimeProperties = {
  es: number;
  jde: number;
  tde: Date;
}