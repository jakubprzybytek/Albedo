import { JulianDay } from "@astro";
import { AstronomicalCoordinates, AzAltCoordinates, Radians } from "@astro/coords";
import { describe, it, expect } from "vitest";
import { JplBody, jplBodyFromString } from "@jpl";
import { kernels } from "@jpl/data/kernels.full";
import { ConjunctionsWithDso } from "../ConjunctionsWithDso";
import { DsoConjunction } from "..";
import { OpenNgcObjectType } from "@openNgc";
import { openNgcObjects } from "@openNgc/data";

describe("ConjunctionsWithDso", () => {
  const filteredOpenNgcObjects = openNgcObjects.filter(ngcObject => ngcObject.name == 'IC4685');
  const conjuctionScripts = new ConjunctionsWithDso(kernels, filteredOpenNgcObjects);

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2026, 1, 1);
    const toJde = JulianDay.fromDate(2026, 1, 8);
    const conjunctions = conjuctionScripts.findConjunctionsWithDso(fromJde, toJde, { longitude: 52, latitude: 17, altitude: 50 });

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 820712982.6859272,
      jde: 2461043.992855161,
      tde: new Date('2026-01-03T11:49:42.000Z'),
      body: {
        info: jplBodyFromString('Mercury') as JplBody,
        ephemeris: {
          angularSize: 0.000023394470951227875,
          coords: new AstronomicalCoordinates(4.75268268490506, -0.4233427626220601),
          range: 208641606.38440073,
          azAltCoords: new AzAltCoordinates(3.023246530640879, 0.839720728439261)
        }
      },
      dso: {
        name: "IC4685",
        type: OpenNgcObjectType["Nebula"],
        rightAscension: 4.752931524467474,
        declination: -0.4186564909990098,
        majorAxis: 0.004363323129985824,
        minorAxis: 0.0029088820866572155,
      },
      separation: 0.004691771630202613,
      separationFactor: 2.6
    } satisfies DsoConjunction);
  }, { timeout: 10000 });
});
