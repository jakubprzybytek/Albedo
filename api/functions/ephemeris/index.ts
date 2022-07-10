import { AstronomicalCoordinates } from '../../math';

export type Ephemeris = {
    jde: number;
    ephemerisSeconds: number;
    tde: Date;
    coords: AstronomicalCoordinates;
};
