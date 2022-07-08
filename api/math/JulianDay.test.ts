import { describe, it, expect } from "vitest";
import { JulianDay } from './';

describe("JulianDay", () => {
    it("should correctly compute from date", () => {
        expect(JulianDay.fromDate(1990, 10, 6)).toBe(2448170.5);
        expect(JulianDay.fromDate(1957, 10, 4.81)).toBe(2436116.31);
        expect(JulianDay.fromDate(1990, 10, 28.54502)).toBe(2448193.04502);
        expect(JulianDay.fromDate(2650, 0, 25)).toBe(2688945.5);
    });

    it("should correctly compute from date object", () => {
        expect(JulianDay.fromDateObject(new Date('1990-10-06'))).toBe(2448170.5);
    });

    it("should generate ranges", () => {
        expect(JulianDay.forRange(10, 13.4, 1.5)).toEqual([10, 11.5, 13]);
    });

    it("should compute georgian from julian", () => {
        expect(JulianDay.toDateTime(2436116.31)).toEqual(new Date(1957, 10, 4, 19, 26, 24));
        expect(JulianDay.toDateTime(1842713.0)).toEqual(new Date(333, 1, 27, 12, 0, 0));
        expect(JulianDay.toDateTime(1507900.13)).toEqual(new Date(-584, 5, 28, 15, 7, 11));
        expect(JulianDay.toDateTime(2458813.740272218)).toEqual(new Date(2019, 11, 26, 5, 45, 59));
    });
});
