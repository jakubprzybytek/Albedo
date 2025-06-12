import { JplBody } from "@jpl";
import { Ephemeris } from "@astro/scripts/ephemeris";
import { RectangularCoordinates } from "@math";

export * from './Separations';
export * from './Separations2';

export type Separation2 = {
    es: number;
    separation: number;
};

export type SeparationWithPositions = Separation2 | {
    firstBodyPosition: RectangularCoordinates;
    secondBodyPosition: RectangularCoordinates;
};

/**
 * @deprecated Do not use
 */
export type SimpleSeparation = {
    jde: number;
    separation: number;
};

/**
 * @deprecated Do not use
 */
export type Separation = {
    jde: number;
    firstBodyEphemeris: Ephemeris;
    secondBodyEphemeris: Ephemeris;
    separation: number;
};

/**
 * @deprecated Do not use
 */
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
