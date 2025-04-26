import { describe, it, expect } from "vitest";
import { JplBodyId } from "../../jpl";
import { AstronomicalCoordinates, JulianDay, Radians } from "../../math";
import { Ephemerides } from "./Ephemerides";

describe("Ephemerides", () => {

    it("should compute ephemeis for Venus", () => {
        const jde = JulianDay.fromDate(2022, 8, 19);
        const ephemeris = Ephemerides.simple(JplBodyId.Venus, jde, jde, 1);

        expect(ephemeris).toHaveLength(1);

        expect(ephemeris[0].jde).toEqual(jde);
        expect(Radians.toDegrees(ephemeris[0].coords.rightAscension)).toBeCloseTo(131.15203800, 8);
        expect(Radians.toDegrees(ephemeris[0].coords.declination)).toBeCloseTo(18.79604293, 8);
    });

});
