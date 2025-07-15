import { JulianDay } from "@astro";
import { AstronomicalCoordinates } from "@astro/coords";
import { describe, it, expect } from "vitest";
import { jplBodyFromString } from "@jpl";
import { kernelRepository } from "@jpl/data/de440.full";
import { Conjunctions } from "../Conjunctions";

describe("Conjunctions", () => {
  const conjuctionScripts = new Conjunctions(kernelRepository.StateSolver());

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2022, 2, 1);
    const toJde = JulianDay.fromDate(2022, 2, 31);
    const conjunctions = conjuctionScripts.all(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toEqual({
      es: 699507671.7832242,
      jde: 2459641.153608602,
      tde: new Date('2022-03-02T15:41:11.000Z'),
      firstBody: {
        info: jplBodyFromString('Mercury'),
        coords: new AstronomicalCoordinates(5.612402662674604, -0.29178842348138884)
      },
      secondBody: {
        info: jplBodyFromString('Saturn'),
        coords: new AstronomicalCoordinates(5.60943612310782, -0.2804312279610099)
      },
      separation: 0.011708338626390445,
    });
  });
});
