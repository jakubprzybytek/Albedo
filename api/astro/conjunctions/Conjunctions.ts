import { JplBody, JplBodyId, jplBodyFromId } from "../../jpl";
import { localMinimums } from '../utils/LocalMinimums';
import { Ephemerides, Ephemeris } from "../ephemeris";
import { Separations } from '../separations';
import { Conjunction } from './';

const PRELIMINARY_INTERVAL = 1;

type BodyWithEphemerides = {
    body: JplBody;
    ephemerides: Ephemeris[];
};

export class Conjunctions {
    static all(fromJde: number, toJde: number): Conjunction[] {
        const bodies: BodyWithEphemerides[] = [JplBodyId.Mercury, JplBodyId.Venus, JplBodyId.Mars, JplBodyId.Jupiter, JplBodyId.Uranus]
            .map(jplBodyFromId)
            .filter((jplBody): jplBody is JplBody => !!jplBody)
            .map((jplBody) => ({
                body: jplBody,
                ephemerides: Ephemerides.simple(jplBody.id, fromJde, toJde, PRELIMINARY_INTERVAL)
            }));

        const bodyPairs: BodyWithEphemerides[][] = new Array();
        for (let i = 0; i < bodies.length - 1; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                bodyPairs.push([bodies[i], bodies[j]]);
            }
        }
        console.log("body pairs " + bodyPairs.length)

        return bodyPairs
            .map((pair) => Separations.fromEphemerides(pair[0].body.id, pair[0].ephemerides, pair[1].body.id, pair[1].ephemerides))
            .flatMap((separations) => localMinimums(separations, element => element.separation))
            .filter((separation) => separation.separation < 20);
    }
};
