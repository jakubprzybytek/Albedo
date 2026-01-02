import { AstronomicalCoordinates, AzAltCoordinates } from '@astro/coords';
import { TimeProperties } from '..';

export * from './Ephemerides';

export type DetailedCoordinates = {
  coords: AstronomicalCoordinates;
  angularSize: number;
  range: number;
}

export type FullCoordinates = DetailedCoordinates & {
  azAltCoords: AzAltCoordinates
}

export type FullCoordinatesWithVelocity = DetailedCoordinates & {
  velocity: AstronomicalCoordinates;
  azAltCoords: AzAltCoordinates
}

export type DetailedEphemeris = TimeProperties & DetailedCoordinates;

export type FullEphemeris = TimeProperties & FullCoordinates;

export type FullEphemerisWithVelocity = TimeProperties & FullCoordinatesWithVelocity;
