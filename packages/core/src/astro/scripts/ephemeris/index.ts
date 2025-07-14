import { AstronomicalCoordinates } from '@astro/coords';

export * from './Ephemerides';

export type Ephemeris = {
    es: number;
    jde: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};
