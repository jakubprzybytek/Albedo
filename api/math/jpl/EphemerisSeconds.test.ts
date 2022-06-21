import { describe, it, expect } from "vitest";
import { JulianDay } from "../";
import { EphemerisSeconds } from './';

describe("EphemerisSeconds", () => {

    it("should calculate from JDE", () => {
        expect(EphemerisSeconds.fromJde(2447751.8293)).toBe(-3.277299484800115E8);
        expect(EphemerisSeconds.fromJde(JulianDay.fromDate(1549, 12, 31))).toBe(-14200747200.0);
        expect(EphemerisSeconds.fromJde(JulianDay.fromDate(2650, 1, 25))).toBe(20514081600.0);
    });

    it("should calculate to JDE", () => {
        expect(EphemerisSeconds.toJde(-3.277299484800115E8)).toBe(2447751.8293);
        expect(EphemerisSeconds.toJde(-14200747200.0)).toBe(JulianDay.fromDate(1549, 12, 31));
        expect(EphemerisSeconds.toJde(20514081600.0)).toBe(JulianDay.fromDate(2650, 1, 25));
    });

});
