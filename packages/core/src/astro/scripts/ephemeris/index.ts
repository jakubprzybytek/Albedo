import { AstronomicalCoordinates } from '../../coords';

export * from './Ephemerides';

export type Ephemeris2 = {
    es: number;
    jde: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};

/**
 * @deprecated The method should not be used
 */
export type Ephemeris = {
    jde: number;
    ephemerisSeconds: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};
