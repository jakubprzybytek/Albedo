import { AstronomicalCoordinates } from '@astro/coords';

export * from './Ephemerides';

export type DetailedCoordinates = {
    coords: AstronomicalCoordinates;
    angularSizeDeg: number;
}

export type Ephemeris = {
    es: number;
    jde: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};

export type DetailedEphemeris = Ephemeris & {
    angularSizeDeg: number;
};
