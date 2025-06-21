import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.testData';
import { CorrectionType2 } from "@jpl/state/solver2";

describe("StateSolver2", () => {

  const stateSolver = kernelRepository.stateSolver2();

  it("should correctly compute uncorrected state for Earth wrt. Solar Barycenter", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(143811325.04688266, 3e-8);
    expect(position.y).approximately(36856589.50987644, 0);
    expect(position.z).approximately(15977853.64250682, 3e-9);

    const reversePosition = stateSolver.positionFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-143811325.04688266, 3e-8);
    expect(reversePosition.y).approximately(-36856589.50987644, 0);
    expect(reversePosition.z).approximately(-15977853.64250682, 3e-9);
  });

  it("should correctly compute light time corrected state for Earth wrt. Solar Barycenter", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(143815452.30964568, 0);
    expect(position.y).approximately(36843505.82316172, 1e-8);
    expect(position.z).approximately(15972181.21362670, 2e-9);

    // const reversePosition = stateSolver.positionFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    // expect(reversePosition.x).approximately(-143815318.1190073, 0);
    // expect(reversePosition.y).approximately(-36843471.42927276, 0);
    // expect(reversePosition.z).approximately(-15972166.30360876, 0);
  });

  it("should correctly compute uncorrected state for Earth wrt. Earth-Moon Barycenter", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(-3854.84331016, 2e-8);
    expect(position.y).approximately(2677.28161003, 1e-8);
    expect(position.z).approximately(1456.05152013, 1e-8);

    const reversePosition = stateSolver.positionFor(JplBodyId.EarthMoonBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(3854.84331016, 2e-8);
    expect(reversePosition.y).approximately(-2677.28161003, 1e-8);
    expect(reversePosition.z).approximately(-1456.05152013, 1e-8);
  });

  it("should correctly compute uncorrected state for Earth wrt. Venus", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(212474107.12560332, 0);
    expect(position.y).approximately(114096424.71648255, 0);
    expect(position.z).approximately(46433127.17153619, 8e-9);

    const reversePosition = stateSolver.positionFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.z).approximately(-46433127.17153619, 8e-9);
  });

  it("should correctly compute light time corrected state for Earth wrt. Venus", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(212480895.01100355, 0);
    expect(position.y).approximately(114074904.11474073, 0);
    expect(position.z).approximately(46423796.92017328, 1e-8);

    const reversePosition = stateSolver.positionFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.LIGHT_TIME);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-212496177.30534464, 6e-8);
    expect(reversePosition.y).approximately(-114080326.47248125, 0);
    expect(reversePosition.z).approximately(-46424486.90050933, 0);
  });

  it("should correctly compute state for Moon wrt. Earth", () => {
    const position = stateSolver.positionFor(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(317255.79483133, 1e-9);
    expect(position.y).approximately(-220341.79779477, 2e-9);
    expect(position.z).approximately(-119833.86746624, 1e-9);

    const reversePosition = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.Moon, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-317255.79483133, 1e-9);
    expect(reversePosition.y).approximately(220341.79779477, 2e-9);
    expect(reversePosition.z).approximately(119833.86746624, 1e-9);
  });

  it("should correctly compute state for Earth wrt. Venus", () => {
    const position = stateSolver.positionFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(212474107.12560332, 0);
    expect(position.y).approximately(114096424.71648255, 0);
    expect(position.z).approximately(46433127.17153619, 8e-9);

    const reversePosition = stateSolver.positionFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9), CorrectionType2.NONE);
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.z).approximately(-46433127.17153619, 8e-9);
  });

  it("should find common ancestor", () => {
    expect(stateSolver.findCommonAncestor([], [])).toEqual(undefined);
    expect(stateSolver.findCommonAncestor([], [JplBodyId.Earth])).toEqual(undefined);
    expect(stateSolver.findCommonAncestor([JplBodyId.Earth], [])).toEqual(undefined);
    expect(stateSolver.findCommonAncestor([JplBodyId.Earth], [JplBodyId.Earth])).toEqual(JplBodyId.Earth);
    expect(stateSolver.findCommonAncestor([JplBodyId.SolarSystemBarycenter], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter])).toEqual(JplBodyId.SolarSystemBarycenter);
    expect(stateSolver.findCommonAncestor([JplBodyId.SolarSystemBarycenter, JplBodyId.VenusBarycenter, JplBodyId.Venus], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter])).toEqual(JplBodyId.SolarSystemBarycenter);
    expect(stateSolver.findCommonAncestor([JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter, JplBodyId.Moon], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter, JplBodyId.Earth])).toEqual(JplBodyId.EarthMoonBarycenter);
  });

});
