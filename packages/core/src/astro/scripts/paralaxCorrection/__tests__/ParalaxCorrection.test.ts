import { describe, it, expect } from "vitest";
import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { kernels } from "@jpl/data/kernels.full";
import { ParalaxCorrection } from "../ParalaxCorrection";
import { CorrectionType } from "@jpl/state";
import { States } from "@astro/scripts/states";

describe("paralaxCorrections", () => {
  const paralaxCorrections = new ParalaxCorrection(kernels);
  const states = new States(kernels.stateSolver());

  it("should compute Sun distance from azimuth for 0°N, 0°E", () => {
    const es = EphemerisSeconds.fromDateTime(2025, 8, 31, 12, 0, 17);

    const observerPosition = paralaxCorrections.observerPosition(0, 0, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(81, 33, 44.2)), 1);
  });

  it("should compute Sun distance from azimuth 0°N, 90°E", () => {
    const es = EphemerisSeconds.fromDateTime(2025, 8, 31, 6, 0, 22);

    const observerPosition = paralaxCorrections.observerPosition(90, 0, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(81, 28, 19.3)), 1);
  });

  it("should compute Sun distance from azimuth 45°N, 90°E", () => {
    const es = EphemerisSeconds.fromDateTime(2025, 8, 31, 6, 0, 24);

    const observerPosition = paralaxCorrections.observerPosition(90, 45, 0, es);
    const sunPostion = states.position(JplBodyId.Sun, JplBodyId.Earth, es, CorrectionType.NONE);
    const separationDec = Radians.toDegrees(Radians.between(observerPosition, sunPostion));

    expect(separationDec).toBeCloseTo(90 - Radians.toDegrees(Radians.fromDegrees2(53, 32, 27.7)), 0);
  });
});
