import { JplBody } from "../../jpl";
import { Ephemeris } from "../ephemeris";

export * from './Conjunctions';

export type Conjunction = {
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
