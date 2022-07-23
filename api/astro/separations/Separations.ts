import { JplBody } from "../../jpl";
import { Ephemerides, Ephemeris } from "../ephemeris";
import { Radians } from "../../math";
import { Separation, SeparationWithBodies } from './';

export class Separations {
    static fromEphemerides(firstBodyEphemerides: Ephemeris[], secondBodyEphemerides: Ephemeris[]): Separation[] {
        return firstBodyEphemerides
            .map((firstBodyEphemeris, index) => {
                const secondBodyEphemeris = secondBodyEphemerides[index];
                return {
                    jde: firstBodyEphemeris.jde,
                    firstBodyEphemeris: firstBodyEphemeris,
                    secondBodyEphemeris: secondBodyEphemeris,
                    separation: Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords)
                }
            });
    }

    static all(firstBody: JplBody, secondBody: JplBody, fromJde: number, toJde: number, interval: number): SeparationWithBodies[] {
        const firstBodyEphemerides = Ephemerides.simple(firstBody.id, fromJde, toJde, interval);
        const secondBodyEphemerides = Ephemerides.simple(secondBody.id, fromJde, toJde, interval);

        return firstBodyEphemerides
            .map((firstBodyEphemeris, index) => {
                const secondBodyEphemeris = secondBodyEphemerides[index]
                return {
                    jde: firstBodyEphemeris.jde,
                    tde: firstBodyEphemeris.tde,
                    firstBody: {
                        info: firstBody,
                        ephemeris: firstBodyEphemeris
                    },
                    secondBody: {
                        info: secondBody,
                        ephemeris: secondBodyEphemeris
                    },
                    separation: Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords)
                }
            });
    }
};
