import { JplBody } from "../../jpl";
import { Ephemeris } from "../ephemeris";

export * from './Separations';
export type Separation = {
    jde: number;
    firstBodyEphemeris: Ephemeris;
    secondBodyEphemeris: Ephemeris;
    separation: number;
};

export type SeparationWithBodies = {
    jde: number;
    tde: Date;
    firstBody: {
        info: JplBody;
        ephemeris: Ephemeris;
    }
    secondBody: {
        info: JplBody;
        ephemeris: Ephemeris;
    }
    separation: number;
};
