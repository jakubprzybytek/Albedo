import { describe, it, expect } from "vitest";
import { JulianDay } from "../../math";
import { Eclipses } from "./Eclipses";

describe("Eclipses", () => {
    it("should compute all eclipses", () => {
        const fromJde = JulianDay.fromDate(2022, 1, 1);
        const toJde = JulianDay.fromDate(2023, 12, 31);
        const eclipses = Eclipses.all(fromJde, toJde);

        expect(eclipses).toHaveLength(2);

        expect(eclipses[0]).toEqual({
            jde: 2459700.5,
            positionAngle: 1,
            separation: 0.03337880922207732,
            tde: new Date(Date.parse('2022-05-01T00:00:00.000Z'))
        });

        expect(eclipses[1]).toEqual({
            jde: 2459907.5,
            positionAngle: 1,
            separation: 0.03137092463972883,
            tde: new Date(Date.parse('2022-11-24T00:00:00.000Z'))
        });
    });
});
