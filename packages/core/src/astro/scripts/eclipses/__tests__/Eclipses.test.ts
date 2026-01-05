import { describe, it, expect } from "vitest";
import { AstronomicalCoordinates, AzAltCoordinates } from "@astro/coords";
import { JulianDay } from "@astro";
import { kernels } from "@jpl/data/kernels.full";
import { Eclipses, EclipseType, SunEclipse } from "@astro/scripts";
import { EphemerisSeconds } from "@jpl";

describe("Eclipses", () => {
  const eclipseScripts = new Eclipses(kernels);

  it("should find all eclipses", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde, { latitude: 52, longitude: 17, altitude: 50 });

    expect(eclipses[0]).toEqual({
      type: EclipseType.MoonEclipse,
      es: 795207639.9959486,
      jde: 2460748.7921295827,
      tde: new Date("2025-03-14T07:00:39.000Z"),
      moonEphemeris: {
        coords: new AstronomicalCoordinates(3.041711860760187, 0.049190155228928806),
        angularSize: 0.008657834791604766,
        azAltCoords: new AzAltCoordinates(0, 0),
        range: 401506.65490064514,
      },
      earthShadowEphemeris: {
        coords: new AstronomicalCoordinates(3.0389340446163278, 0.044399759055822184),
        umbraAngularSize: 0.011250560584877509,
        penumbraAngularSize: 0.041206007275612494
      },
      separation: 0.005525133562433181,
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      es: 796519463.985411,
      jde: 2460763.9752776087,
      tde: new Date("2025-03-29T11:24:23.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(0.13894241228773077, 0.05992748229308506),
        range: 149370287.58239618,
        azAltCoords: new AzAltCoordinates(1.9928255784377686, 0.712069609820411),
        angularSize: 0.009315038228360568,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.13415122509590302, 0.06592955389696199),
        range: 354394.9049766343,
        azAltCoords: new AzAltCoordinates(1.9979299030098794, 0.7187062136465859),
        angularSize: 0.009804802817175735,
      },
      separation: 0.007673948455627674,
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
        angularSize: 0.008657834791604766,
        azAltCoords: new AzAltCoordinates(0, 0),
        range: 401506.65490064514,
      },
      earthShadowEphemeris: {
        coords: new AstronomicalCoordinates(3.0389340446163278, 0.044399759055822184),
        umbraAngularSize: 0.011250560584877509,
        penumbraAngularSize: 0.041206007275612494
      },
      separation: 0.005525133562433181,
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      es: 796520502.7603303,
      jde: 2460763.9873004667,
      tde: new Date("2025-03-29T11:41:42.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(0.13910761251843207, 0.060030436941542954),
        range: 149370585.28654447,
        azAltCoords: new AzAltCoordinates(2.4131049600369465, 1.3142495735378434),
        angularSize: 0.009315019663223309,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.12606208954536086, 0.07640152396296336),
        range: 354220.84024982114,
        azAltCoords: new AzAltCoordinates(2.4359185276078463, 1.3344108009142002),
        angularSize: 0.009809620836797936,
      },
      separation: 0.02091419600799461,
    } as SunEclipse);

    expect(eclipses).toHaveLength(2);
  });

  it.skip("should perform fast", () => {
    const fromEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2025, 1, 1));
    const toEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2025, 12, 31));

    for (let i = 0; i < 50; i++) {
      const eclipses = eclipseScripts.forSunAndMoon(fromEs, toEs, { latitude: 52, longitude: 17, altitude: 50 });
      expect(eclipses).toHaveLength(4);
    }
  });
});
