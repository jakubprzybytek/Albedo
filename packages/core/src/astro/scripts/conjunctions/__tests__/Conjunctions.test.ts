import { JulianDay } from "@astro";
import { AstronomicalCoordinates, AzAltCoordinates } from "@astro/coords";
import { describe, it, expect } from "vitest";
import { JplBody, jplBodyFromString } from "@jpl";
import { kernels } from "@jpl/data/kernels.full";
import { Conjunctions } from "../Conjunctions";
import { Conjunction } from "..";

describe("Conjunctions", () => {
  const conjuctionScripts = new Conjunctions(kernels);

  it("should find conjunctions for all bodies", () => {
    const fromJde = JulianDay.fromDate(2024, 4, 20);
    const toJde = JulianDay.fromDate(2024, 4, 30);
    const conjunctions = conjuctionScripts.find(fromJde, toJde, { longitude: 52, latitude: 17, altitude: 50 });

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 767637118.3790983,
      jde: 2460429.6888701282,
      tde: new Date('2024-04-29T04:31:58.000Z'),
      firstBody: {
        info: jplBodyFromString('Mars') as JplBody,
        ephemeris: {
          angularSize: 0.000022892354620145867,
          coords: new AstronomicalCoordinates(6.268537473397251, -0.030441513190657125),
          range: 296709539.59999794,
          azAltCoords: new AzAltCoordinates(1.384184449951694, 0.2545172706595791)
        }
      },
      secondBody: {
        info: jplBodyFromString('Neptune') as JplBody,
        ephemeris: {
          angularSize: 0.00001079847227762168,
          coords: new AstronomicalCoordinates(6.268293157279016, -0.029885088234573462),
          range: 4586574723.366985,
          azAltCoords: new AzAltCoordinates(1.3837158075866753, 0.25492170034120504)
        }
      },
      separation: 0.0006076551692939348,
    } satisfies Conjunction);
  });

  it("should find conjunctions for all bodies for a given obsever location", () => {
    const fromJde = JulianDay.fromDate(2024, 4, 20);
    const toJde = JulianDay.fromDate(2024, 4, 30);
    const conjunctions = conjuctionScripts.find(fromJde, toJde, { longitude: 52, latitude: 17, altitude: 50 });

    expect(conjunctions).toHaveLength(1);

    expect(conjunctions[0]).toStrictEqual({
      es: 767637118.3790983,
      jde: 2460429.6888701282,
      tde: new Date('2024-04-29T04:31:58.000Z'),
      firstBody: {
        info: jplBodyFromString('Mars') as JplBody,
        ephemeris: {
          angularSize: 0.000022892354620145867,
          coords: new AstronomicalCoordinates(6.268537473397251, -0.030441513190657125),
          range: 296709539.59999794,
          azAltCoords: new AzAltCoordinates(1.384184449951694, 0.2545172706595791)
        }
      },
      secondBody: {
        info: jplBodyFromString('Neptune') as JplBody,
        ephemeris: {
          angularSize: 0.00001079847227762168,
          coords: new AstronomicalCoordinates(6.268293157279016, -0.029885088234573462),
          range: 4586574723.366985,
          azAltCoords: new AzAltCoordinates(1.3837158075866753, 0.25492170034120504)
        }
      },
      separation: 0.0006076551692939348,
    } satisfies Conjunction);
  });
});
