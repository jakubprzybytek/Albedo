import { JplBodyId } from "../../jpl";
import { Ephemerides } from "../../jpl/ephemeris";
import { Radians } from "../../math";
import { localMinimums } from './LocalMinimums';
import { Conjunction } from './';

const PRELIMINARY_INTERVAL = 1;

export class Conjunctions {
    static all(fromJde: number, toJde: number): Conjunction[] {
        const sunEphemerides = Ephemerides.simple(JplBodyId.Sun, fromJde, toJde, PRELIMINARY_INTERVAL);
        const mercuryEphemerides = Ephemerides.simple(JplBodyId.Mercury, fromJde, toJde, PRELIMINARY_INTERVAL);
        const venusEphemerides = Ephemerides.simple(JplBodyId.Venus, fromJde, toJde, PRELIMINARY_INTERVAL);

        const sepearations = mercuryEphemerides
            .map((mercuryEphemeris, index) => {
                const venusEphemeris = venusEphemerides[index]
                return {
                    jde: mercuryEphemeris.jde,
                    ephemerisSeconds: mercuryEphemeris.ephemerisSeconds,
                    tde: mercuryEphemeris.tde,
                    firstBody: {
                        id: JplBodyId.Mercury,
                        ephemeris: mercuryEphemeris
                    },
                    secondBody: {
                        id: JplBodyId.Venus,
                        ephemeris: venusEphemeris
                    },
                    separation: Radians.toDegrees(
                        Radians.separation(mercuryEphemeris.coords, venusEphemeris.coords))
                }
            });

        return localMinimums(sepearations, element => element.separation)
    }
};
