import { describe, it, expect } from "vitest";
import { JulianDay } from "@astro";
import { EphemerisSeconds } from '..';

describe("EphemerisSeconds", () => {

    it("should calculate from JDE", () => {
        expect(EphemerisSeconds.fromJde(2447751.8293)).toBe(-3.277299484800115E8);
        expect(EphemerisSeconds.fromJde(2458764.5416666665)).toBe(623768399.9999866);
        expect(EphemerisSeconds.fromJde(JulianDay.fromDate(1549, 12, 31))).toBe(-14200747200.0);
        expect(EphemerisSeconds.fromJde(JulianDay.fromDate(2650, 1, 25))).toBe(20514081600.0);
    });
    
    it("should calculate to JDE", () => {
        expect(EphemerisSeconds.toJde(-3.277299484800115E8)).toBe(2447751.8293);
        expect(EphemerisSeconds.toJde(623768400)).toBe(2458764.5416666665);
        expect(EphemerisSeconds.toJde(-14200747200.0)).toBe(JulianDay.fromDate(1549, 12, 31));
        expect(EphemerisSeconds.toJde(20514081600.0)).toBe(JulianDay.fromDate(2650, 1, 25));
    });
    
    it("should calculate from Date object", () => {
        expect(EphemerisSeconds.fromDateTimeObject(new Date(Date.UTC(2019, 9, 8, 1, 0, 0, 0)))).toBe(623768400);
    });

    it("should calculate from days", () => {
        expect(EphemerisSeconds.fromDays(1)).toBe(86400.0);
    });

    it("should calculate to days", () => {
        expect(EphemerisSeconds.toDays(86400.0)).toBe(1);
    });

    it("should generate range", () => {
        expect(EphemerisSeconds.forRange(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    });
});
