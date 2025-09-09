import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernels } from "@jpl/data/kernels.testData";
import { CorrectionType } from "@jpl/state";

describe("StateSolver", () => {

  const stateSolver = kernels.stateSolver();

  it("should compute position for Earth wrt. Solar Barycenter: uncorrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(position.coords.x).approximately(143811325.04688266, 3e-8);
    expect(position.coords.y).approximately(36856589.50987644, 0);
    expect(position.coords.z).approximately(15977853.64250682, 3e-9);

    expect(position.lightTime).toEqual(0);

    const reversePosition = stateSolver.position(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(reversePosition.coords.x).approximately(-143811325.04688266, 3e-8);
    expect(reversePosition.coords.y).approximately(-36856589.50987644, 0);
    expect(reversePosition.coords.z).approximately(-15977853.64250682, 3e-9);

    expect(reversePosition.lightTime).toEqual(0);
  });

  it("should compute position for Earth wrt. Solar Barycenter: light time corrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.LIGHT_TIME);

    expect(position.coords.x).approximately(143815452.30964568, 0);
    expect(position.coords.y).approximately(36843505.82316172, 1e-8);
    expect(position.coords.z).approximately(15972181.21362670, 2e-9);

    expect(position.lightTime).approximately(498.06647397, 5e-4);

    const reversePosition = stateSolver.position(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.LIGHT_TIME);

    expect(reversePosition.coords.x).approximately(-143811325.04688263, 0);
    expect(reversePosition.coords.y).approximately(-36856589.50987644, 0);
    expect(reversePosition.coords.z).approximately(-15977853.642506817, 0);

    expect(reversePosition.lightTime).approximately(498.0660092236716, 0);
  });

  it("should compute position for Earth wrt. Earth-Moon Barycenter: uncorrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(position.coords.x).approximately(-3854.84331016, 2e-8);
    expect(position.coords.y).approximately(2677.28161003, 1e-8);
    expect(position.coords.z).approximately(1456.05152013, 1e-8);

    expect(position.lightTime).approximately(0, 0);

    const reversePosition = stateSolver.position(JplBodyId.EarthMoonBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(reversePosition.coords.x).approximately(3854.84331016, 2e-8);
    expect(reversePosition.coords.y).approximately(-2677.28161003, 1e-8);
    expect(reversePosition.coords.z).approximately(-1456.05152013, 1e-8);

    expect(reversePosition.lightTime).approximately(0, 0);
  });

  it("should compute position for Earth wrt. Venus: uncorrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(position.coords.x).approximately(212474107.12560332, 0);
    expect(position.coords.y).approximately(114096424.71648255, 0);
    expect(position.coords.z).approximately(46433127.17153619, 8e-9);

    expect(position.lightTime).approximately(0, 0);

    const reversePosition = stateSolver.position(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE);

    expect(reversePosition.coords.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.coords.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.coords.z).approximately(-46433127.17153619, 8e-9);

    expect(reversePosition.lightTime).approximately(0, 0);
  });

  it("should compute position for Earth wrt. Venus: light time corrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.LIGHT_TIME).coords;

    expect(position.x).approximately(212480895.01100355, 0);
    expect(position.y).approximately(114074904.11474073, 0);
    expect(position.z).approximately(46423796.92017328, 1e-8);

    const reversePosition = stateSolver.position(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.LIGHT_TIME).coords;

    expect(reversePosition.x).approximately(-212496177.30534464, 6e-8);
    expect(reversePosition.y).approximately(-114080326.47248125, 0);
    expect(reversePosition.z).approximately(-46424486.90050933, 0);
  });

  it("should compute position for Moon wrt. Earth: uncorrected", () => {
    const position = stateSolver.position(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE).coords;

    expect(position.x).approximately(317255.79483133, 1e-9);
    expect(position.y).approximately(-220341.79779477, 2e-9);
    expect(position.z).approximately(-119833.86746624, 1e-9);

    const reversePosition = stateSolver.position(JplBodyId.Earth, JplBodyId.Moon, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE).coords;

    expect(reversePosition.x).approximately(-317255.79483133, 1e-9);
    expect(reversePosition.y).approximately(220341.79779477, 2e-9);
    expect(reversePosition.z).approximately(119833.86746624, 1e-9);
  });

  it("should compute position for Earth wrt. Venus: uncorrected", () => {
    const position = stateSolver.position(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE).coords;

    expect(position.x).approximately(212474107.12560332, 0);
    expect(position.y).approximately(114096424.71648255, 0);
    expect(position.z).approximately(46433127.17153619, 8e-9);

    const reversePosition = stateSolver.position(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType.NONE).coords;

    expect(reversePosition.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.z).approximately(-46433127.17153619, 8e-9);
  });

});
