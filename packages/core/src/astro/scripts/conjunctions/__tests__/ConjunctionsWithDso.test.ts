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
    const toJde = JulianDay.fromDate(2024, 1, 10);
    const conjunctions = conjuctionScripts.findConjunctionsWithDso(fromJde, toJde);

    expect(conjunctions).toHaveLength(24);

    expect(conjunctions[0]).toStrictEqual({
      es: 757507306.4444026,
      jde: 2460312.44567644,
      tde: new Date('2024-01-02T22:41:46.000Z'),
      body: {
        info: jplBodyFromString('Venus') as JplBody,
        ephemeris: {
          angularSize: 0.00006775728581838766,
          coords: new AstronomicalCoordinates(4.2420248605159, -0.33519850968920445),
          range: 178631712.43032137
        }
      },
      dso: {
        name: "IC4592",
        type: OpenNgcObjectType["Reflection Nebula"],
        rightAscension: 4.241053362016839,
        declination: -0.3395479882113234,
        majorAxis: 0.017453292519943295,
        minorAxis: 0.011635528346628862,
      },
      separation: 0.004445037711602649,
    } satisfies DsoConjunction);
  }, { timeout: 10000 });
});
