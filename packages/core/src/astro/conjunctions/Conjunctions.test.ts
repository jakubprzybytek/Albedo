import { describe, it, expect } from "vitest";
import { jplBodyFromString } from "../../jpl";
import { AstronomicalCoordinates, JulianDay } from "../../math";
import { Conjunctions } from "./Conjunctions";

describe("Conjunctions", () => {
    it("should compute conjunctions for all bodies", () => {
        const fromJde = JulianDay.fromDate(2022, 8, 1);
        const toJde = JulianDay.fromDate(2022, 9, 31);
        const conjunctions = Conjunctions.all(fromJde, toJde);

        expect(conjunctions).toHaveLength(1);

        expect(conjunctions[0]).toEqual({
            jde: 2459793.5,
            tde: new Date(Date.parse('2022-08-02T00:00:00.000Z')),
            firstBody: {
                info: jplBodyFromString('Mars'),
                ephemeris: {
                    jde: 2459793.5,
                    ephemerisSeconds: 712670400,
                    tde: new Date(Date.parse('2022-08-02T00:00:00.000Z')),
                    coords: new AstronomicalCoordinates(0.8102253922602426, 0.2738987260932604)
                }
            },
            secondBody: {
                info: jplBodyFromString('Uranus'),
                ephemeris: {
                    jde: 2459793.5,
                    ephemerisSeconds: 712670400,
                    tde: new Date(Date.parse('2022-08-02T00:00:00.000Z')),
                    coords: new AstronomicalCoordinates(0.8036263316489981, 0.2958694475845389)
                }
            },
            separation: 0.022865224044365383
        });
    });
});
