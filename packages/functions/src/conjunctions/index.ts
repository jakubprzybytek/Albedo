import { AstronomicalCoordinates } from "@astro/coords";
import { JplBody } from "@jpl";

export type Conjunction = {
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
