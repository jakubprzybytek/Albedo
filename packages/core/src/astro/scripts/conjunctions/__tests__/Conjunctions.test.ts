import { JulianDay } from "@astro";
import { AstronomicalCoordinates } from "@astro/coords";
import { describe, it, expect } from "vitest";
import { JplBody, jplBodyFromString } from "@jpl";
import { kernels } from "@jpl/data/kernels.full";
import { Conjunctions } from "../Conjunctions";
import { Conjunction } from "..";

describe("Conjunctions", () => {
  const conjuctionScripts = new Conjunctions(kernels);

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2024, 4, 20);
    const toJde = JulianDay.fromDate(2024, 4, 30);
    const conjunctions = conjuctionScripts.all(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 767637130.476549,
      jde: 2460429.689010145,
      tde: new Date('2024-04-29T04:32:10.000Z'),
      firstBody: {
        info: jplBodyFromString('Mars') as JplBody,
        ephemeris: {
          angularSize: 0.00002289199651289324,
          coords: new AstronomicalCoordinates(6.268531423986194, -0.030433985916438734)
        }
      },
      secondBody: {
        info: jplBodyFromString('Neptune') as JplBody,
        ephemeris: {
          angularSize: 0.000010798459637903887,
          coords: new AstronomicalCoordinates(6.268292723456754, -0.02988462206159836)
        }
      },
      separation: 0.0005989380399368273,
    } satisfies Conjunction);
  });
});
