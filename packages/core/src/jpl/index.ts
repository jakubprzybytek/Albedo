export * from './BodyType';
export * from './JplBody';
export * from './EphemerisSeconds';

export const SPEED_OF_LIGHT = 299792.457999999984;

export const AU = 149597870.699999988;

export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export type Matrix6x6 = [
  [number, number, number, number, number, number],
  [number, number, number, number, number, number],
  [number, number, number, number, number, number],
  [number, number, number, number, number, number],
  [number, number, number, number, number, number],
  [number, number, number, number, number, number]
];

export type Vector3 = [number, number, number];
