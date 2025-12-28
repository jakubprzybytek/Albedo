import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { JulianDay } from "@astro";
import { AstronomicalCoordinates, AzAltCoordinates, Radians } from "@astro/coords";
import { Ephemerides } from "@astro/scripts";
import { kernels } from "@jpl/data/kernels.testData";

const OBSERVER = { latitude: 52, longitude: 17, altitude: 50 };

describe("Ephemerides", () => {

  const ephemerisScripts = new Ephemerides(kernels);

  describe("should build coordinates function", () => {
    it("that compute astronomical coodinates for Venus", () => {
      const es = EphemerisSeconds.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.buildCoordinatesFunction(JplBodyId.Venus)(es);

      expect(Radians.toDegrees(ephemeris.rightAscension)).approximately(209.39848483, 3e-9);
      expect(Radians.toDegrees(ephemeris.declination)).toBeCloseTo(-11.36105059, 0);
    });

    it("that compute astronomical coodinates for Venus with paralax correction", () => {
      const es = EphemerisSeconds.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.buildCoordinatesFunction(JplBodyId.Venus, OBSERVER)(es);

      expect(Radians.toDegrees(ephemeris.rightAscension)).eq(209.39857037294303);
      expect(Radians.toDegrees(ephemeris.declination)).eq(-11.36201460681129);
    });

    it("that correct paralax", () => {
      const es = EphemerisSeconds.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.buildCoordinatesFunction(JplBodyId.Venus)(es);
      const paralaxCorrectedEphemeris = ephemerisScripts.buildCoordinatesFunction(JplBodyId.Venus, OBSERVER)(es);

      const maximumParalaxCorrectionAngle = Math.atan(6378 / 240000000);
      expect(Radians.separation(paralaxCorrectedEphemeris, ephemeris)).toBeLessThanOrEqual(maximumParalaxCorrectionAngle);
    });
  });

  describe("should compute full coordinates", () => {
    it("for Venus", () => {
      const jde = JulianDay.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.fullCoordinates(JplBodyId.Venus, jde, { latitude: 52, longitude: 17, altitude: 50 });

      expect(ephemeris).toEqual({
        range: 245179680.85845146,
        angularSize: 0.000049366244197575465,
        coords: new AstronomicalCoordinates(3.6546945019769064, -0.19830456454854592),
        azAltCoords: new AzAltCoordinates(5.071588159641652, -0.8440970159209716)
      });
    });
  });

  describe("should compute full coordinates with velocity", () => {
    it("for Venus", () => {
      const jde = JulianDay.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.fullCoordinatesWithVelocity(JplBodyId.Venus, jde, { latitude: 52, longitude: 17, altitude: 50 });

      expect(ephemeris).toEqual({
        range: 245179680.85845146,
        angularSize: 0.000049366244197575465,
        coords: new AstronomicalCoordinates(3.6546945019769064, -0.19830456454854592),
        velocity: new AstronomicalCoordinates(2.387571900186458e-7, -9.403411957431551e-8),
        azAltCoords: new AzAltCoordinates(5.071588159641652, -0.8440970159209716)
      });
    });
  });

});
