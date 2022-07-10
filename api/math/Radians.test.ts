import { describe, it, expect } from "vitest";
import { JulianDay } from '.';
import { Radians } from "./Radians";

describe("Radians", () => {
    it("should calculate radians from degrees", () => {
        expect(Radians.fromDegrees(45)).toEqual(0.7853981633974483);
    });
});
