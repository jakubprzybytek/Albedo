import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernelRepository } from "@jpl/data/de440.testData";
import { JulianDay } from "@astro";
import { Separations2 } from "../Separations2";

describe("Separations", () => {
  const separationScripts = new Separations2(kernelRepository.stateSolver2());

  it("should compute separations for Moon and Venus", () => {
    const fromEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 8));
    const toEs = EphemerisSeconds.fromJde(JulianDay.fromDate(2019, 10, 12));
    const interval = EphemerisSeconds.fromDays(1);

    const separations = separationScripts.for(JplBodyId.Moon, JplBodyId.Venus, fromEs, toEs, interval);

    expect(separations).toStrictEqual([
      {
        "jde": 2458764.5,
        "separation": 1.7635931535096159,
      },
      {
        "jde": 2458765.5,
        "separation": 1.9492963453410979,
      },
      {
        "jde": 2458766.5,
        "separation": 2.1335691362854017,
      },
      {
        "jde": 2458767.5,
        "separation": 2.317390923506916,
      },
      {
        "jde": 2458768.5,
        "separation": 2.5014741168256633,
      },
    ]);

    expect(separations).toHaveLength(5);
  });
});
