import { describe, it, expect } from "vitest";
import { JplBodyId } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";
import { JulianDay } from "@astro";
import { Separations } from "../Separations";

describe("Separations", () => {
  const separationScripts = new Separations(kernels.stateSolver());

  it("should compute separations for Moon and Venus", () => {
    const fromEs = JulianDay.fromDate(2019, 10, 9);
    const toEs = JulianDay.fromDate(2019, 10, 11);
    const interval = 1;

    const separations = separationScripts.for(JplBodyId.Moon, JplBodyId.Venus, fromEs, toEs, interval);

    expect(separations).toStrictEqual([
      {
        "es": 623851200,
        "jde": 2458765.5,
        "tde": new Date('2019-10-09T00:00:00.000Z'),
        "separation": 1.9494988303927896,
      },
      {
        "es": 623937600,
        "jde": 2458766.5,
        "tde": new Date('2019-10-10T00:00:00.000Z'),
        "separation": 2.13377112990052,
      },
      {
        "es": 624024000,
        "jde": 2458767.5,
        "tde": new Date('2019-10-11T00:00:00.000Z'),
        "separation": 2.317592289423942,
      },
    ]);

    expect(separations).toHaveLength(3);
  });
});
