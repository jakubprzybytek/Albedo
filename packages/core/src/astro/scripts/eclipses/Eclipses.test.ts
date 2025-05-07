import { describe, it, expect } from "vitest";
import { JulianDay } from "../../coords";
import { Eclipses } from "./Eclipses";
import { Conjunctions } from "@astro/scripts/conjunctions";

describe("Eclipses", () => {
  it("should compute all eclipses", () => {
    const fromJde = JulianDay.fromDate(2022, 1, 1);
    const toJde = JulianDay.fromDate(2023, 12, 31);
    const eclipses = Eclipses.all(fromJde, toJde);

    expect(eclipses).toHaveLength(6);

    expect(eclipses[0]).toEqual({
      jde: 2459700.25,
      positionAngle: 1,
      separation: 0.02960649415339207,
      tde: new Date(Date.parse('2022-04-30T18:00:00.000Z'))
    });

    expect(eclipses[1]).toEqual({
      jde: 2459730,
      positionAngle: 1,
      separation: 0.026800828001796204,
      tde: new Date(Date.parse('2022-05-30T12:00:00.000Z'))
    });
  });

  it("should find all eclipses", () => {
    const fromJde = JulianDay.fromDate(2025, 3, 1);
    const toJde = JulianDay.fromDate(2025, 3, 31);

    Conjunctions.forSunAndMoon(fromJde, toJde);
  });
});
