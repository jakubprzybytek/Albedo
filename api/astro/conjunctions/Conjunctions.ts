import { JplBody, JplBodyId, jplBodyFromId } from "../../jpl";
import { localMinimums } from '../utils/LocalMinimums';
import { Ephemerides, Ephemeris } from "../ephemeris";
import { Separations } from '../separations';
import { Conjunction } from './';
import { JulianDay, Radians } from "../../math";

const PRELIMINARY_INTERVAL = 1;

const SEPARATION_THRESHOLD = Radians.fromDegrees(2);

type BodyWithEphemerides = {
    body: JplBody;
    ephemerides: Ephemeris[];
};

type EphemerisPair = {
    first: BodyWithEphemerides;
    second: BodyWithEphemerides;
}

export class Conjunctions {
    static all(fromJde: number, toJde: number): Conjunction[] {
        const bodies: BodyWithEphemerides[] = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Saturn, JplBodyId.Uranus, JplBodyId.Neptune, JplBodyId.Pluto]
            .map(jplBodyFromId)
            .filter((jplBody): jplBody is JplBody => !!jplBody)
            .map((jplBody) => ({
                body: jplBody,
                ephemerides: Ephemerides.simple(jplBody.id, fromJde, toJde, PRELIMINARY_INTERVAL)
            }));

        const bodyPairs: EphemerisPair[] = new Array();
        for (let i = 0; i < bodies.length - 1; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                bodyPairs.push({ first: bodies[i], second: bodies[j] });
            }
        }

        return bodyPairs
            .map((pair) => ({
                firstBody: pair.first.body,
                secondBody: pair.second.body,
                separations: localMinimums(
                    Separations.fromEphemerides(pair.first.ephemerides, pair.second.ephemerides),
                    element => element.separation
                )
                    .filter((separation) => separation.separation < SEPARATION_THRESHOLD)
            }))
            .flatMap((pair) => {
                return pair.separations
                    .map((separation) => ({
                        jde: separation.jde,
                        tde: JulianDay.toDateTime(separation.jde),
                        firstBody: {
                            info: pair.firstBody,
                            ephemeris: separation.firstBodyEphemeris,
                        },
                        secondBody: {
                            info: pair.secondBody,
                            ephemeris: separation.secondBodyEphemeris
                        },
                        separation: separation.separation
                    }));
            });
    }
};
