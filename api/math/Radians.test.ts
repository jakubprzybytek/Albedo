import { describe, it, expect } from "vitest";
import { AstronomicalCoordinates, JulianDay } from '.';
import { Radians } from "./Radians";

const ONE_HUNDREDTH_SECOND_PRECISION = 5; // -log(15.0 / 3600.0 / 100.0);
const ONE_TENTH_ARCSECOND_PRECISION = 5; // -log(1.0 / 3600.0 / 10.0);

describe("Radians", () => {
    it("should calculate radians from degrees", () => {
        expect(Radians.fromDegrees(45)).toEqual(0.7853981633974483);
    });

    it("should calculate degrees from radians", () => {
        expect(Radians.toDegrees(0.7853981633974483)).toEqual(45);
    });

    it("should calculate radians from hours, minutes and seconds", () => {
        expect(Radians.toDegrees(Radians.fromHours(1, 0, 0))).toBeCloseTo(15, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromHours(1, 1, 1))).toBeCloseTo(15.254167, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromHours(14, 15, 39.7))).toBeCloseTo(213.91542, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromHours(13, 25, 11.6))).toBeCloseTo(201.29833, ONE_TENTH_ARCSECOND_PRECISION);
    });

    it("should calculate radians from degrees, arcminutes and arcseconds", () => {
        expect(Radians.toDegrees(Radians.fromDegrees2(1, 0, 0))).toBeCloseTo(1, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromDegrees2(1, 1, 1))).toBeCloseTo(1.016944, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromDegrees2(19, 10, 57.0))).toBeCloseTo(19.1825, 4);
        expect(Radians.toDegrees(Radians.fromDegrees2(-11, 9, 41.0))).toBeCloseTo(-11.1614, 4);
        expect(Radians.toDegrees(Radians.fromDegrees2(52, 23, 39.85))).toBeCloseTo(52.3944028, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.fromDegrees2(-16, 52, 28.2))).toBeCloseTo(-16.8745, 4);
    });

    it("should calculate separation", () => {
        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(1, 0),
            AstronomicalCoordinates.fromDegrees(-2, 0))))
            .toBeCloseTo(3, 15);
        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(-2, 0),
            AstronomicalCoordinates.fromDegrees(1, 0))))
            .toBeCloseTo(3, 15);
        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(10, 2),
            AstronomicalCoordinates.fromDegrees(10, -2))))
            .toBeCloseTo(4, 15);
        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(10, -1),
            AstronomicalCoordinates.fromDegrees(10, 3))))
            .toBeCloseTo(4, 15);

        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(213.9154, 19.1825),
            AstronomicalCoordinates.fromDegrees(201.2983, -11.1614))))
            .toBeCloseTo(32.79303, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.separation(
            new AstronomicalCoordinates(Radians.fromHours(10, 23, 17.65), Radians.fromDegrees2(11, 31, 46.3)),
            new AstronomicalCoordinates(Radians.fromHours(10, 33, 1.23), Radians.fromDegrees2(10, 42, 53.5)))))
            .toBeCloseTo(2.52114, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.separation(
            new AstronomicalCoordinates(Radians.fromHours(10, 29, 44.27), Radians.fromDegrees2(11, 2, 5.9)),
            new AstronomicalCoordinates(Radians.fromHours(10, 33, 29.64), Radians.fromDegrees2(10, 40, 13.2)))))
            .toBeCloseTo(0.99171, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.separation(
            new AstronomicalCoordinates(Radians.fromHours(10, 36, 19.63), Radians.fromDegrees2(10, 29, 51.7)),
            new AstronomicalCoordinates(Radians.fromHours(10, 33, 57.97), Radians.fromDegrees2(10, 37, 33.4)))))
            .toBeCloseTo(0.59425, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.separation(
            new AstronomicalCoordinates(Radians.fromHours(10, 43, 1.75), Radians.fromDegrees2(9, 55, 16.7)),
            new AstronomicalCoordinates(Radians.fromHours(10, 34, 26.22), Radians.fromDegrees2(10, 34, 53.9)))))
            .toBeCloseTo(2.21448, ONE_TENTH_ARCSECOND_PRECISION);
        expect(Radians.toDegrees(Radians.separation(
            new AstronomicalCoordinates(Radians.fromHours(10, 49, 48.85), Radians.fromDegrees2(9, 18, 34.7)),
            new AstronomicalCoordinates(Radians.fromHours(10, 34, 54.39), Radians.fromDegrees2(10, 32, 14.9)))))
            .toBeCloseTo(3.87095, ONE_TENTH_ARCSECOND_PRECISION);

        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(0, 88),
            AstronomicalCoordinates.fromDegrees(180, 88))))
            .toBeCloseTo(4, 10);

        expect(Radians.toDegrees(Radians.separation(
            AstronomicalCoordinates.fromDegrees(0, 45),
            AstronomicalCoordinates.fromDegrees(180, -45))))
            .toBeCloseTo(180, 10);
    });
});
