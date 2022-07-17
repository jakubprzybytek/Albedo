import { JplBodyId } from "../../jpl";
import { Ephemerides } from "../../jpl/ephemeris";
import { Radians } from "../../math";
import { Separation } from '.';

export class Separations {
    static all(firstBodyId: JplBodyId, secondBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Separation[] {
        const firstBodyEphemerides = Ephemerides.simple(firstBodyId, fromJde, toJde, interval);
        const secondBodyEphemerides = Ephemerides.simple(secondBodyId, fromJde, toJde, interval);

        return firstBodyEphemerides
            .map((mercuryEphemeris, index) => {
                const secondBodyEphemeris = secondBodyEphemerides[index]
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
                        ephemeris: secondBodyEphemeris
                    },
                    separation: Radians.toDegrees(
                        Radians.separation(mercuryEphemeris.coords, secondBodyEphemeris.coords))
                }
            });
    }
};
