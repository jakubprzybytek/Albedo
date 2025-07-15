import { describe, it, expect } from "vitest";
import { AstronomicalCoordinates } from "@math";
import { JulianDay } from "@astro";
import { kernelRepository } from "@jpl/data/de440.full";
import { Eclipses, EclipseType } from "@astro/scripts";
import { EphemerisSeconds } from "@jpl";

describe("Eclipses", () => {
  const eclipseScripts = new Eclipses(kernelRepository.StateSolver());

  it("should find all eclipses", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    const eclipses = eclipseScripts.forSunAndMoon(fromJde, toJde);

    expect(eclipses[0]).toEqual({
      type: EclipseType.MoonEclipse,
      es: 795207639.9959486,
      jde: 2460748.7921295827,
      tde: new Date("2025-03-14T07:00:39.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(6.180526698206121, -0.044399759055822184),
        angularSize: 0.5365104150326545,
      },
      moonShadowEphemeris: {
        coords: new AstronomicalCoordinates(0.0000000000000000, 0.0000000000000000),
        angularSize: 0,
      },
      separation: 0.005525133562433181,
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      es: 796517348.7948847,
      jde: 2460763.950796237,
      tde: new Date("2025-03-29T10:49:08.000Z"),
      sunEphemeris: {
        coords: new AstronomicalCoordinates(0.13855635227796734, 0.05979282636397052),
        angularSize: 0.5341974289462799,
      },
      moonEphemeris: {
        coords: new AstronomicalCoordinates(0.12974496732111232, 0.07602384021766552),
        angularSize: 0.5550339393241165,
      },
      separation: 0.018468100092825915,
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
