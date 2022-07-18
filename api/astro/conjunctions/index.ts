import { JplBodyId } from "../../jpl";
import { Ephemeris } from "../ephemeris";

export * from './Conjunctions';

export type Conjunction = {
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
