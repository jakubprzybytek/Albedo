import { describe, it, expect } from "vitest";
import { jplBodyFromString } from "@jpl";
import { JulianDay } from "@astro";
import { AstronomicalCoordinates } from "@astro/coords";
import { Conjunctions } from "../Conjunctions";

describe("Conjunctions", () => {
    it("should compute conjunctions for all bodies", () => {
        const fromJde = JulianDay.fromDate(2022, 8, 1);
        const toJde = JulianDay.fromDate(2022, 9, 31);
        const conjunctions = Conjunctions.all(fromJde, toJde);

        expect(conjunctions).toHaveLength(1);

        expect(conjunctions[0]).toEqual({
            jde: 2459793.5207796507,
            tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
            firstBody: {
                info: jplBodyFromString('Mars'),
                ephemeris: {
                    jde: 2459793.5207796507,
                    ephemerisSeconds: 712672195.3618169,
                    tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
                    coords: new AstronomicalCoordinates(0.8104572828489092, 0.2739654718548906)
                }
            },
            secondBody: {
                info: jplBodyFromString('Uranus'),
                ephemeris: {
                    jde: 2459793.5207796507,
                    ephemerisSeconds: 712672195.3618169,
                    tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
                    coords: new AstronomicalCoordinates(0.80363307066834, 0.2958712333969532)
                }
            },
            separation: 0.02286292525872858
        });
    });
});
