import { AstronomicalCoordinates } from '@astro/coords';

export * from './Ephemerides';

export type DetailedCoordinates = {
    coords: AstronomicalCoordinates;
    angularSize: number;
    range: number;
}

export type DetailedCoordinatesWithVelocity = DetailedCoordinates & {
    velocity: AstronomicalCoordinates;
}

export type DetailedEphemeris = {
    es: number;
    jde: number;
    tde: Date;
    coords: AstronomicalCoordinates;
    angularSize: number;
    range: number;
};

export type EphemerisWithVelocity = DetailedEphemeris & {
    velocity: AstronomicalCoordinates;
};
