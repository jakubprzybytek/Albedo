export const ALTITUDE_TARGET_NAMES = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
] as const;

export type AltitudeTargetName = typeof ALTITUDE_TARGET_NAMES[number];

export type SolarEventType =
  | 'sunrise'
  | 'sunset'
  | 'civilDawn'
  | 'civilDusk'
  | 'nauticalDawn'
  | 'nauticalDusk'
  | 'astronomicalDawn'
  | 'astronomicalDusk';