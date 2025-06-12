import { AstronomicalCoordinates } from "@math";
import { JplBody } from "../../../jpl";
import { Ephemeris } from "@astro/scripts";

export * from './Conjunctions';
export * from './Conjunctions2';

export type Conjunction2 = {
    es: number;
    jde: number;
    tde: Date;
    firstBody: {
        info: JplBody;
        coords: AstronomicalCoordinates;
    }
    secondBody: {
        info: JplBody;
        coords: AstronomicalCoordinates;
    }
    separation: number;
};

/**
 * @deprecated The method should not be used
 */
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
