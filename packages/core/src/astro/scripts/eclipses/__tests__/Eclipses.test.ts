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
        angularSizeDeg: 0.5337011221156522,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.12965149645366136, 0.07597343274846731),
        angularSizeDeg: 0.5552523079421643,
      },
      separation: 0.01845852713317203,
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
