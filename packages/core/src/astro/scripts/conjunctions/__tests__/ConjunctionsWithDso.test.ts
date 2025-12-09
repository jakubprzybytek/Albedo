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
  const filteredOpenNgcObjects = openNgcObjects.filter(ngcObject => ngcObject.name == 'IC4685');
  const conjuctionScripts = new ConjunctionsWithDso(kernels, filteredOpenNgcObjects);

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2026, 1, 1);
    const toJde = JulianDay.fromDate(2026, 1, 8);
    const conjunctions = conjuctionScripts.findConjunctionsWithDso(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 820712868.8673649,
      jde: 2461043.991537817,
      tde: new Date('2026-01-03T11:47:48.000Z'),
      body: {
        info: jplBodyFromString('Mercury') as JplBody,
        ephemeris: {
          angularSize: 0.000023386420039559303,
          coords: new AstronomicalCoordinates(4.752671483403667, -0.423326831626858),
          range: 208642451.1115366
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
      separation: 0.004676367124766821,
      separationFactor: 2.6
    } satisfies DsoConjunction);
  }, { timeout: 10000 });
});
