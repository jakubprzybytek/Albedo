import { JplBodyId } from "../../jpl";
import { Ephemeris } from "../../jpl/ephemeris";

export * from './Separations';

export type Separation = {
    jde: number;
    ephemerisSeconds: number;
    tde: Date;
    firstBody: {
        id: JplBodyId;
        ephemeris: Ephemeris;
    }
    secondBody: {
        id: JplBodyId;
        ephemeris: Ephemeris;
    }
    separation: number;
};
