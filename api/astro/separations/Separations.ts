import { JplBodyId } from "../../jpl";
import { Ephemerides, Ephemeris } from "../ephemeris";
import { Radians } from "../../math";
import { Separation } from './';

export class Separations {
    static fromEphemerides(firstBodyId: JplBodyId, firstBodyEphemerides: Ephemeris[], secondBodyId: JplBodyId, secondBodyEphemerides: Ephemeris[]): Separation[] {
        return firstBodyEphemerides
            .map((firstBodyEphemeris, index) => {
                const secondBodyEphemeris = secondBodyEphemerides[index];
                return {
                    jde: firstBodyEphemeris.jde,
                    tde: firstBodyEphemeris.tde,
                    firstBody: {
                        id: firstBodyId,
                        ephemeris: firstBodyEphemeris
                    },
                    secondBody: {
                        id: secondBodyId,
                        ephemeris: secondBodyEphemeris
                    },
                    separation: Radians.toDegrees(
                        Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords))
                }
            });
    }

    static all(firstBodyId: JplBodyId, secondBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Separation[] {
        const firstBodyEphemerides = Ephemerides.simple(firstBodyId, fromJde, toJde, interval);
        const secondBodyEphemerides = Ephemerides.simple(secondBodyId, fromJde, toJde, interval);

        return firstBodyEphemerides
            .map((firstBodyEphemeris, index) => {
                const secondBodyEphemeris = secondBodyEphemerides[index]
                return {
                    jde: firstBodyEphemeris.jde,
                    tde: firstBodyEphemeris.tde,
                    firstBody: {
                        id: JplBodyId.Mercury,
                        ephemeris: firstBodyEphemeris
                    },
                    secondBody: {
                        id: JplBodyId.Venus,
                        ephemeris: secondBodyEphemeris
                    },
                    separation: Radians.toDegrees(
                        Radians.separation(firstBodyEphemeris.coords, secondBodyEphemeris.coords))
                }
            });
    }
};
