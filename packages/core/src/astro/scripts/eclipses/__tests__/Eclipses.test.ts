import { describe, it, expect } from "vitest";
import { JulianDay } from "@astro";
import { Eclipses } from "../Eclipses";
import { EclipseType } from "..";

describe("Eclipses", () => {
  it("should compute all eclipses", () => {
    const fromJde = JulianDay.fromDate(2022, 1, 1);
    const toJde = JulianDay.fromDate(2023, 12, 31);
    const eclipses = Eclipses.all(fromJde, toJde);

    expect(eclipses).toHaveLength(6);

    expect(eclipses[0]).toEqual({
      type: EclipseType.SunEclipse,
      jde: 2459700.25,
      eventTimeRangeWidthSeconds: NaN,
      positionAngle: 1,
      separation: 0.02960649415339207,
      tde: new Date(Date.parse('2022-04-30T18:00:00.000Z'))
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      jde: 2459730,
      eventTimeRangeWidthSeconds: NaN,
      positionAngle: 1,
      separation: 0.026800828001796204,
      tde: new Date(Date.parse('2022-05-30T12:00:00.000Z'))
    });
  });

  it("should find all eclipses", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    const eclipses = Eclipses.forSunAndMoon(fromJde, toJde);

    expect(eclipses[0]).toEqual({
      type: EclipseType.MoonEclipse,
      jde: 2460748.7921295827,
      eventTimeRangeWidthSeconds: 9.241629958152771,
      positionAngle: NaN,
      separation: 0.005525133562433181,
      tde: new Date(Date.parse('2025-03-14T07:00:39.000Z'))
    });

    expect(eclipses[1]).toEqual({
      type: EclipseType.SunEclipse,
      jde: 2460763.950796237,
      eventTimeRangeWidthSeconds: 9.24163007736206,
      positionAngle: NaN,
      separation: 0.018468100092825915,
      tde: new Date(Date.parse('2025-03-29T10:49:08.000Z'))
    });

    expect(eclipses).toHaveLength(2);
  });

  it("should perform fast", () => {
    const fromJde = JulianDay.fromDate(2025, 1, 1);
    const toJde = JulianDay.fromDate(2025, 12, 31);

    for (let i = 0; i < 10; i++) {
      const eclipses = Eclipses.forSunAndMoon(fromJde, toJde);
      expect(eclipses).toHaveLength(4);
    }

  });
});
