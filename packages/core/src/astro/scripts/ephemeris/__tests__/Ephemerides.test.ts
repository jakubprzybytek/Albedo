import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { JulianDay } from "@astro";
import { Radians } from "@astro/coords";
import { DetailedEphemeris, Ephemerides } from "@astro/scripts";
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

  describe("should compute ephemeris with velocity", () => {
    it("for Venus", () => {
      const jde = JulianDay.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.computeEphemeridesWithVelocity(JplBodyId.Venus, jde, jde, 1);

      const { coords, ...mainProperties } = ephemeris[0];

      expect(mainProperties).toEqual({
        es: 623937600,
        jde: 2458766.5,
        tde: new Date('2019-10-10T00:00:00.000Z'),
        range: 245174846.9550577,
        angularSize: 0.0000493672175097167,
        velocity: {
          declination: -9.401312947576734e-8,
          rightAscension: 2.3757238221122634e-7,
        },
      } as Omit<DetailedEphemeris, 'coords'>);

      expect(Radians.toDegrees(coords.rightAscension)).approximately(209.39848483, 3e-9);
      expect(Radians.toDegrees(coords.declination)).toBeCloseTo(-11.36105059, 0);
    });
  });

  describe("should compute full ephemeris", () => {
    it("for Venus", () => {
      const jde = JulianDay.fromDate(2019, 10, 10);
      const ephemeris = ephemerisScripts.fullEphemerisForBody(JplBodyId.Venus, jde);

      expect(ephemeris).toEqual({
        range: 245174846.9550577,
        angularSize: 0.0000493672175097167,
        // coords: {
        //   declination: -0.19828773921887338,
        //   rightAscension: 3.6546930090133447,
        // },
        coords: {
          declination: -11.361050586432135,
          rightAscension: 209.39848483243196,
        },
        fixedBodyCoords: {
          declination: -0.6257192160919699,
          rightAscension: 306.2947868468457,
        },
      });
    });
  });

});
