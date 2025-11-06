import { describe, it, expect } from "vitest";
import { AstronomicalCoordinates } from "@astro/coords";
import { JulianDay } from "@astro";
import { kernels } from "@jpl/data/kernels.full";
import { Eclipses, EclipseType } from "@astro/scripts";
import { EphemerisSeconds } from "@jpl";

describe("Eclipses", () => {
  const eclipseScripts = new Eclipses(kernels);

  it("should find all eclipses", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde);

    expect(eclipses[0]).toEqual({
      type: EclipseType.MoonEclipse,
      es: 795207639.9959486,
      jde: 2460748.7921295827,
      tde: new Date("2025-03-14T07:00:39.000Z"),
      moonEphemeris: {
        coords: new AstronomicalCoordinates(3.041711860760187, 0.049190155228928806),
        angularSizeDeg: 0.4960573932804797,
      },
      earthShadowEphemeris: {
        coords: new AstronomicalCoordinates(3.0389340446163278, 0.044399759055822184),
        umbraAngularSizeDeg: 0.6446096386697163,
        penumbraAngularSizeDeg: 2.3609303074779597
      },
      separation: 0.005525133562433181,
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      es: 796517314.169167,
      jde: 2460763.9503954765,
      tde: new Date("2025-03-29T10:48:34.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(0.13854998329884816, 0.05979010143020168),
        range: 149373437.45989782,
        angularSize: 0.009314841802506456,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.12965149645366136, 0.07597343274846731),
        range: 358701.8498141572,
        angularSize: 0.009690980952888227,
      },
      separation: 0.01845852713317203,
    });

    expect(eclipses).toHaveLength(2);
  });

  it("should find all eclipses with paralax correction", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde, {
      longitude: 51,
      latitude: 17,
      altitude: 50
    });

    expect(eclipses[0]).toEqual({
      type: EclipseType.MoonEclipse,
      es: 795207639.9959486,
      jde: 2460748.7921295827,
      tde: new Date("2025-03-14T07:00:39.000Z"),
      moonEphemeris: {
        coords: new AstronomicalCoordinates(3.041711860760187, 0.049190155228928806),
        angularSizeDeg: 0.4960573932804797,
      },
      earthShadowEphemeris: {
        coords: new AstronomicalCoordinates(3.0389340446163278, 0.044399759055822184),
        umbraAngularSizeDeg: 0.6446096386697163,
        penumbraAngularSizeDeg: 2.3609303074779597
      },
      separation: 0.005525133562433181,
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      es: 796520502.7603303,
      jde: 2460763.9873004667,
      tde: new Date("2025-03-29T11:41:42.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(0.1391364884269545, 0.060041020601183714),
        range: 149375014.90044126,
        angularSize: 0.009314743436681058,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.1382633286775636, 0.08061316700001137),
        range: 358649.01292460336,
        angularSize: 0.009692408625223449,
      },
      separation: 0.02091419600799461,
    });

    expect(eclipses).toHaveLength(2);
  });

  it.skip("should perform fast", () => {
    const fromEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2025, 1, 1));
    const toEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2025, 12, 31));

    for (let i = 0; i < 50; i++) {
      const eclipses = eclipseScripts.forSunAndMoon(fromEs, toEs);
      expect(eclipses).toHaveLength(4);
    }
  });
});
