import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType2 } from "@jpl/state/solver2";
import { kernelRepository } from '@jpl/data/de440.testData';

describe("StateSolver2", () => {

  const stateSolver = kernelRepository.stateSolver2();

  it("should correctly compute uncorrected state for Earth wrt. Solar Barycenter", () => {
    const state = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(state.position.x).approximately(143811325.04688266, 3e-8);
    expect(state.position.y).approximately(36856589.50987644, 0);
    expect(state.position.z).approximately(15977853.64250682, 3e-9);
    expect(state.lightTime).approximately(0, 0);

    const reverseState = stateSolver.stateFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(reverseState.position.x).approximately(-143811325.04688266, 3e-8);
    expect(reverseState.position.y).approximately(-36856589.50987644, 0);
    expect(reverseState.position.z).approximately(-15977853.64250682, 3e-9);
    expect(reverseState.lightTime).approximately(0, 0);
  });

  it("should correctly compute light time corrected state for Earth wrt. Solar Barycenter", () => {
    const state = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(state.position.x).approximately(143815452.30964568, 0);
    expect(state.position.y).approximately(36843505.82316172, 1e-8);
    expect(state.position.z).approximately(15972181.21362670, 2e-9);

    expect(state.lightTime).approximately(498.06647397, 5e-4);

    const reverseState = stateSolver.stateFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    // not from WebGeocalc
    expect(reverseState.position.x).approximately(-143811325.04688263, 0);
    expect(reverseState.position.y).approximately(-36856589.50987644, 0);
    expect(reverseState.position.z).approximately(-15977853.642506817, 0);

    expect(reverseState.lightTime).approximately(498.0660092236716, 0);
  });

});
