import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { CorrectionType2 } from "@jpl/state/solver2";
import { kernelRepository } from '@jpl/data/de440.testData';

describe("StateSolver2", () => {

  const stateSolver = kernelRepository.stateSolver2();

  // ---------------------- Earth wrt. Solar Barycenter ---------------------- 

  it("should correctly compute uncorrected state for Earth wrt. Solar Barycenter", () => {
    const state = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(state.position.x).approximately(143811325.04688266, 3e-8);
    expect(state.position.y).approximately(36856589.50987644, 0);
    expect(state.position.z).approximately(15977853.64250682, 3e-9);

    expect(state.velocity.x).approximately(-8.28800013, 5e-9);
    expect(state.velocity.y).approximately(26.26862274, 2e-9);
    expect(state.velocity.z).approximately(11.38875394, 4e-9);

    expect(state.lightTime).approximately(0, 0);

    const reverseState = stateSolver.stateFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(reverseState.position.x).approximately(-143811325.04688266, 3e-8);
    expect(reverseState.position.y).approximately(-36856589.50987644, 0);
    expect(reverseState.position.z).approximately(-15977853.64250682, 3e-9);

    expect(reverseState.velocity.x).approximately(8.28800013, 5e-9);
    expect(reverseState.velocity.y).approximately(-26.26862274, 2e-9);
    expect(reverseState.velocity.z).approximately(-11.38875394, 4e-9);

    expect(reverseState.lightTime).approximately(0, 0);
  });

  it("should correctly compute light time corrected state for Earth wrt. Solar Barycenter", () => {
    const state = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(state.position.x).approximately(143815452.30964568, 0);
    expect(state.position.y).approximately(36843505.82316172, 1e-8);
    expect(state.position.z).approximately(15972181.21362670, 2e-9);

    // expect(state.lightTime).approximately(498.06647397, 5e-4); // one correction
    expect(state.lightTime).approximately(498.06647397, 3e-9);

    const reverseState = stateSolver.stateFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    // not from WebGeocalc
    expect(reverseState.position.x).approximately(-143811325.04688263, 0);
    expect(reverseState.position.y).approximately(-36856589.50987644, 0);
    expect(reverseState.position.z).approximately(-15977853.642506817, 0);

    expect(reverseState.lightTime).approximately(498.0660092236716, 0);
  });

  // ---------------------- Moon wrt. Earth ----------------------

  it("should correctly compute uncorrected state for Moon wrt. Earth", () => {
    const state = stateSolver.stateFor(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(state.position.x).approximately(317255.79483133, 1e-9);
    expect(state.position.y).approximately(-220341.79779477, 2e-9);
    expect(state.position.z).approximately(-119833.86746624, 1e-9);

    expect(state.velocity.x).approximately(0.61117702, 3e-9);
    expect(state.velocity.y).approximately(0.71471102, 5e-9);
    expect(state.velocity.z).approximately(0.23678987, 5e-9);

    expect(state.lightTime).approximately(0, 0);

    const reverseState = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.Moon, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(reverseState.position.x).approximately(-317255.79483133, 1e-9);
    expect(reverseState.position.y).approximately(220341.79779477, 2e-9);
    expect(reverseState.position.z).approximately(119833.86746624, 1e-9);

    expect(reverseState.velocity.x).approximately(-0.61117702, 3e-9);
    expect(reverseState.velocity.y).approximately(-0.71471102, 5e-9);
    expect(reverseState.velocity.z).approximately(-0.23678987, 5e-9);

    expect(reverseState.lightTime).approximately(0, 0);
  });

  it("should correctly compute light time corrected state for Moon wrt. Earth", () => {
    const state = stateSolver.stateFor(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(state.position.x).approximately(317266.15105996, 5e-9);
    expect(state.position.y).approximately(-220378.19901913, 2e-8);
    expect(state.position.z).approximately(-119849.55062936, 3e-9);

    expect(state.velocity.x).approximately(0.61118783, 1e-5);
    expect(state.velocity.y).approximately(0.71470935, 2e-7);
    expect(state.velocity.z).approximately(0.23678894, 1e-7);

    expect(state.lightTime).approximately(1.34913492, 5e-9);

    const reverseState = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.Moon, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(reverseState.position.x).approximately(-317244.61410716, 2e-9);
    expect(reverseState.position.y).approximately(220306.36073307, 8e-9);
    expect(reverseState.position.z).approximately(119818.50373818, 1e-8);

    expect(reverseState.velocity.x).approximately(-0.61116877, 1e-5);
    expect(reverseState.velocity.y).approximately(-0.71471083, 1e-6);
    expect(reverseState.velocity.z).approximately(-0.23678978, 1e-7);

    expect(reverseState.lightTime).approximately(1.34891733, 1e-9);
  });

  // ---------------------- Venus wrt. Earth ----------------------

  it("should correctly compute uncorrected state for Venus wrt. Earth", () => {
    const state = stateSolver.stateFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(state.position.x).approximately(-212474107.12560332, 0);
    expect(state.position.y).approximately(-114096424.71648255, 0);
    expect(state.position.z).approximately(-46433127.17153619, 8e-9);

    expect(state.velocity.x).approximately(35.23097452, 5e-9);
    expect(state.velocity.y).approximately(-45.91566415, 4e-9);
    expect(state.velocity.z).approximately(-21.93421529, 3e-9);

    expect(state.lightTime).approximately(0, 0);

    const reverseState = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);

    expect(reverseState.position.x).approximately(212474107.12560332, 0);
    expect(reverseState.position.y).approximately(114096424.71648255, 0);
    expect(reverseState.position.z).approximately(46433127.17153619, 8e-9);

    expect(reverseState.velocity.x).approximately(-35.23097452, 5e-9);
    expect(reverseState.velocity.y).approximately(45.91566415, 4e-9);
    expect(reverseState.velocity.z).approximately(21.93421529, 3e-9);

    expect(state.lightTime).approximately(0, 0);

    expect(reverseState.lightTime).approximately(0, 0);
  });

  it("should correctly compute light time corrected state for Venus wrt. Earth", () => {
    const state = stateSolver.stateFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(state.position.x).approximately(-212496177.30534464, 6e-8);
    expect(state.position.y).approximately(-114080326.47248125, 0);
    expect(state.position.z).approximately(-46424486.90050933, 0);

    expect(state.velocity.x).approximately(35.22558917, 5e-4);
    expect(state.velocity.y).approximately(-45.92268669, 4e-4);
    expect(state.velocity.z).approximately(-21.93703436, 3e-4);

    expect(state.lightTime).approximately(819.26614366, 3e-9);

    const reverseState = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);

    expect(reverseState.position.x).approximately(212480895.01100355, 0);
    expect(reverseState.position.y).approximately(114074904.11474073, 0);
    expect(reverseState.position.z).approximately(46423796.92017328, 1e-8);

    expect(reverseState.velocity.x).approximately(-35.22643388, 2e-4);
    expect(reverseState.velocity.y).approximately(45.91728205, 5e-4);
    expect(reverseState.velocity.z).approximately(21.93491815, 2e-4);

    expect(reverseState.lightTime).approximately(819.21320416, 4e-9);
  });

  it("should correctly compute converged light time corrected state for Venus wrt. Earth", () => {
    const state = stateSolver.stateFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.CONVERGED_NEWTONIAN_LIGHT_TIME);

    expect(state.position.x).approximately(-212496178.2023557, 3e-8);
    expect(state.position.y).approximately(-114080325.81800866, 0);
    expect(state.position.z).approximately(-46424486.54925574, 0);

    expect(state.lightTime).approximately(819.26614501, 1e-9);

    const reverseState = stateSolver.stateFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.CONVERGED_NEWTONIAN_LIGHT_TIME);

    expect(reverseState.position.x).approximately(212480894.84831744, 0);
    expect(reverseState.position.y).approximately(114074904.63068509, 2e-8);
    expect(reverseState.position.z).approximately(46423797.14386084, 1e-8);

    expect(reverseState.lightTime).approximately(819.21320463, 3e-9);
  });

});
