import { describe, it, expect } from "vitest";
import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernels } from "@jpl/data/kernels.testData";
import { ParalaxCorrection } from "../ParalaxCorrection";
import { CorrectionType } from "@jpl/state";
import { States } from "@astro/scripts/states";

describe("paralaxCorrections", () => {
  const paralaxCorrections = new ParalaxCorrection(kernels);
  const states = new States(kernels.stateSolver());

  it("should compute Sun distance from azimuth for 0°N, 0°E", () => {
    const es = EphemerisSeconds.fromDateTime(2019, 10, 9, 11, 47, 18);

    const observerPosition = paralaxCorrections.observerPosition(0, 0, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(83, 44, 56.1)), 1);
  });

  it("should compute Sun distance from azimuth 0°N, 90°E", () => {
    const es = EphemerisSeconds.fromDateTime(2019, 10, 9, 5, 47, 23);

    const observerPosition = paralaxCorrections.observerPosition(90, 0, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(83, 50, 38.1)), 1);
  });

  it("should compute Sun distance from azimuth 45°N, 90°E", () => {
    const es = EphemerisSeconds.fromDateTime(2019, 10, 9, 5, 47, 8);

    const observerPosition = paralaxCorrections.observerPosition(90, 45, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(38, 51, 40.2)), 0);
  });
});
