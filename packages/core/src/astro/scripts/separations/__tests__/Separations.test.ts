import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernelRepository } from "@jpl/data/de440.testData";
import { JulianDay } from "@astro";
import { Separations2 } from "../Separations2";

describe("Separations", () => {
  const separationScripts = new Separations2(kernelRepository.stateSolver2());

  it("should compute separations for Moon and Venus", () => {
    const fromEs = JulianDay.fromDate(2019, 10, 8);
    const toEs = JulianDay.fromDate(2019, 10, 12);
    const interval = 1;

    const separations = separationScripts.for(JplBodyId.Moon, JplBodyId.Venus, fromEs, toEs, interval);

    expect(separations).toStrictEqual([
      {
        "es": 623764800,
        "jde": 2458764.5,
        "tde": new Date('2019-10-08T00:00:00.000Z'),
        "separation": 1.7635931535096159,
      },
      {
        "es": 623851200,
        "jde": 2458765.5,
        "tde": new Date('2019-10-09T00:00:00.000Z'),
        "separation": 1.9492963453410979,
      },
      {
        "es": 623937600,
        "jde": 2458766.5,
        "tde": new Date('2019-10-10T00:00:00.000Z'),
        "separation": 2.1335691362854017,
      },
      {
        "es": 624024000,
        "jde": 2458767.5,
        "tde": new Date('2019-10-11T00:00:00.000Z'),
        "separation": 2.317390923506916,
      },
      {
        "es": 624110400,
        "jde": 2458768.5,
        "tde": new Date('2019-10-12T00:00:00.000Z'),
        "separation": 2.5014741168256633,
      },
    ]);

    expect(separations).toHaveLength(5);
  });
});
