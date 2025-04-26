import { AstronomicalCoordinates } from '../../math';

export * from './Ephemerides';

export type Ephemeris = {
    jde: number;
    ephemerisSeconds: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};
