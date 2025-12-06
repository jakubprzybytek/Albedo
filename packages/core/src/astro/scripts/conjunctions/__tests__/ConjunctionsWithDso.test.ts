import { JulianDay } from "@astro";
import { AstronomicalCoordinates, Radians } from "@astro/coords";
import { describe, it, expect } from "vitest";
import { JplBody, jplBodyFromString } from "@jpl";
import { kernels } from "@jpl/data/kernels.full";
import { ConjunctionsWithDso } from "../ConjunctionsWithDso";
import { DsoConjunction } from "..";
import { OpenNgcObjectType } from "@openNgc";
import { openNgcObjects } from "@openNgc/data";

describe("ConjunctionsWithDso", () => {
  const conjuctionScripts = new ConjunctionsWithDso(kernels, openNgcObjects);

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2024, 1, 1);
    const toJde = JulianDay.fromDate(2024, 1, 31);
    const conjunctions = conjuctionScripts.findConjunctionsWithDso(fromJde, toJde);

    console.log(conjunctions);

    expect(conjunctions).toHaveLength(58);

    expect(conjunctions[0]).toStrictEqual({
      es: 758376018.0899954,
      jde: 2460322.500209375,
      tde: new Date('2024-01-13T00:00:18.000Z'),
      body: {
        info: jplBodyFromString('Mercury') as JplBody,
        ephemeris: {
          angularSize: 0.000031954655296513917,
          coords: new AstronomicalCoordinates(4.6839067379632215, -0.38207825315982513),
          range: 152697625.8797922
        }
      },
      dso: {
        declination: -0.3887740301364613,
        declinationDeg: -22.27511111111111,
        majorAxis: Radians.fromDegrees(9 / 60),
        name: "NGC6469",
        rightAscension: 4.682727836967568,
        rightAscensionDeg: 268.3005416666667,
        type: OpenNgcObjectType["Open Cluster"],
      },
      separation: 0.00678430488600484,
    } satisfies DsoConjunction);
  });
});
