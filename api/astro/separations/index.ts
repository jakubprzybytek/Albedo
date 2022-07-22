import { JplBodyId } from "../../jpl";
import { Ephemeris } from "../ephemeris";

export * from './Separations';

export type Separation = {
    jde: number;
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
