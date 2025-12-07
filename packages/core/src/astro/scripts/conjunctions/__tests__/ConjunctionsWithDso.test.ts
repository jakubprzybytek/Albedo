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
  const filteredOpenNgcObjects = openNgcObjects.filter(ngcObject => ngcObject.name == 'NGC6369');
  const conjuctionScripts = new ConjunctionsWithDso(kernels, filteredOpenNgcObjects);

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2025, 12, 7);
    const toJde = JulianDay.fromDate(2025, 12, 14);
    const conjunctions = conjuctionScripts.findConjunctionsWithDso(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 818290164.5959318,
      jde: 2461015.9509791196,
      tde: new Date('2025-12-06T10:49:24.000Z'),
      body: {
        info: jplBodyFromString('Mars') as JplBody,
        ephemeris: {
          angularSize: 0.00001873613462208236,
          coords: new AstronomicalCoordinates(4.578375813971508, -0.41812934138311586),
          range: 362529419.05081064
        }
      },
      dso: {
        name: "NGC6369",
        type: OpenNgcObjectType["Planetary Nebula"],
        rightAscension: 4.578616765424541,
        declination: -0.41468053400023047,
        majorAxis: 0.0001832595714594046,
      },
      separation: 0.0034558402242048196,
    } satisfies DsoConjunction);
  }, { timeout: 10000 });
});
