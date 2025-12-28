import { AstronomicalCoordinates, AzAltCoordinates } from '@astro/coords';
import { TimeProperties } from '..';

export * from './Ephemerides';

export type DetailedCoordinates = {
  coords: AstronomicalCoordinates;
  angularSize: number;
  range: number;
}

export type DetailedCoordinatesWithVelocity = DetailedCoordinates & {
  velocity: AstronomicalCoordinates;
}

export type FullCoordinates = DetailedCoordinates & {
  azAltCoords: AzAltCoordinates
}

export type FullCoordinatesWithVelocity = DetailedCoordinatesWithVelocity & {
  azAltCoords: AzAltCoordinates
}

export type DetailedEphemeris = TimeProperties & DetailedCoordinates;

export type EphemerisWithVelocity = TimeProperties & DetailedCoordinatesWithVelocity;

export type FullEphemeris = TimeProperties & FullCoordinates & {
};

export type FullEphemerisWithVelocity = TimeProperties & FullCoordinatesWithVelocity;
