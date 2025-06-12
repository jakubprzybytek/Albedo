import { describe, it, expect } from "vitest";
import { EphemerisSeconds, jplBodyFromString } from "@jpl";
import { kernelRepository } from "@jpl/data/de440.full";
import { JulianDay } from "@astro";
import { AstronomicalCoordinates } from "@astro/coords";
import { Conjunctions } from "../Conjunctions";
import { Conjunctions2 } from "../Conjunctions2";

describe("Conjunctions", () => {
  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2022, 8, 1);
    const toJde = JulianDay.fromDate(2022, 9, 31);
    const conjunctions = Conjunctions.all(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toEqual({
      jde: 2459793.5207796507,
      tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
      firstBody: {
        info: jplBodyFromString('Mars'),
        ephemeris: {
          jde: 2459793.5207796507,
          ephemerisSeconds: 712672195.3618169,
          tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
          coords: new AstronomicalCoordinates(0.8104572828489092, 0.2739654718548906)
        }
      },
      secondBody: {
        info: jplBodyFromString('Uranus'),
        ephemeris: {
          jde: 2459793.5207796507,
          ephemerisSeconds: 712672195.3618169,
          tde: new Date(Date.parse('2022-08-02T00:29:55.000Z')),
          coords: new AstronomicalCoordinates(0.80363307066834, 0.2958712333969532)
        }
      },
      separation: 0.02286292525872858
    });
  });
});

describe("Conjunctions2", () => {
  const conjuctionScripts = new Conjunctions2(kernelRepository.stateSolver2());

  it("should compute conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2022, 2, 1);
    const toJde = JulianDay.fromDate(2022, 2, 31);
    const conjunctions = conjuctionScripts.all(fromJde, toJde);

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toEqual({
      es: 699507509.4788908,
      jde: 2459641.1517300797,
      tde: new Date('2022-03-02T15:38:29.000Z'),
      firstBody: {
        info: jplBodyFromString('Mercury'),
        coords: new AstronomicalCoordinates(5.612524627528013, -0.2917585367986864)
      },
      secondBody: {
        info: jplBodyFromString('Saturn'),
        coords: new AstronomicalCoordinates(5.609555483374938, -0.28039555253075243)
      },
      separation: 0.011714567835536118,
    });
  });
});
