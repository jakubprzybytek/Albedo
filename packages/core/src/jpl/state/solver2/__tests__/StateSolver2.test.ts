import { describe, it, expect } from "vitest";
import { EphemerisSeconds, JplBodyId } from '@jpl';
import { kernelRepository } from '@jpl/data/de440.testData';
import { StateSolver2 } from "../StateSolver";


describe("StateSolver2", () => {

  it("should correctly compute state for Earth wrt. Solar Barycenter", () => {
    const stateSolcer = kernelRepository.stateSolver2();
    const position = stateSolcer.positionFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(143811325.04688266, 3e-8);
    expect(position.y).approximately(36856589.50987644, 0);
    expect(position.z).approximately(15977853.64250682, 3e-9);

    const reversePosition = stateSolcer.positionFor(JplBodyId.SolarSystemBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-143811325.04688266, 3e-8);
    expect(reversePosition.y).approximately(-36856589.50987644, 0);
    expect(reversePosition.z).approximately(-15977853.64250682, 3e-9);
  });

  it("should correctly compute state for Earth wrt. Earth-Moon Barycenter", () => {
    const stateSolcer = kernelRepository.stateSolver2();
    const position = stateSolcer.positionFor(JplBodyId.Earth, JplBodyId.EarthMoonBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(-3854.84331016, 2e-8);
    expect(position.y).approximately(2677.28161003, 1e-8);
    expect(position.z).approximately(1456.05152013, 1e-8);

    const reversePosition = stateSolcer.positionFor(JplBodyId.EarthMoonBarycenter, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(3854.84331016, 2e-8);
    expect(reversePosition.y).approximately(-2677.28161003, 1e-8);
    expect(reversePosition.z).approximately(-1456.05152013, 1e-8);
  });

  it("should correctly compute state for Earth wrt. Venus", () => {
    const stateSolcer = kernelRepository.stateSolver2();
    const position = stateSolcer.positionFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(212474107.12560332, 0);
    expect(position.y).approximately(114096424.71648255, 0);
    expect(position.z).approximately(46433127.17153619, 8e-9);

    const reversePosition = stateSolcer.positionFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.z).approximately(-46433127.17153619, 8e-9);
  });

  it("should correctly compute state for Moon wrt. Earth", () => {
    const stateSolcer = kernelRepository.stateSolver2();
    const position = stateSolcer.positionFor(JplBodyId.Moon, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(317255.79483133, 1e-9);
    expect(position.y).approximately(-220341.79779477, 2e-9);
    expect(position.z).approximately(-119833.86746624, 1e-9);

    const reversePosition = stateSolcer.positionFor(JplBodyId.Earth, JplBodyId.Moon, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-317255.79483133, 1e-9);
    expect(reversePosition.y).approximately(220341.79779477, 2e-9);
    expect(reversePosition.z).approximately(119833.86746624, 1e-9);
  });

  it("should correctly compute state for Earth wrt. Venus", () => {
    const stateSolcer = kernelRepository.stateSolver2();
    const position = stateSolcer.positionFor(JplBodyId.Earth, JplBodyId.Venus, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(position.x).approximately(212474107.12560332, 0);
    expect(position.y).approximately(114096424.71648255, 0);
    expect(position.z).approximately(46433127.17153619, 8e-9);

    const reversePosition = stateSolcer.positionFor(JplBodyId.Venus, JplBodyId.Earth, EphemerisSeconds.fromDate(2019, 10, 9));
    // const velocity = stateSolcer.velocityFor(JplBodyId.Earth, JplBodyId.SolarSystemBarycenter, EphemerisSeconds.fromDate(2019, 10, 9));

    expect(reversePosition.x).approximately(-212474107.12560332, 0);
    expect(reversePosition.y).approximately(-114096424.71648255, 0);
    expect(reversePosition.z).approximately(-46433127.17153619, 8e-9);
  });

  it("should find common ancestor", () => {
    expect(StateSolver2.prototype.findCommonAncestor([], [])).toEqual(undefined);
    expect(StateSolver2.prototype.findCommonAncestor([], [JplBodyId.Earth])).toEqual(undefined);
    expect(StateSolver2.prototype.findCommonAncestor([JplBodyId.Earth], [])).toEqual(undefined);
    expect(StateSolver2.prototype.findCommonAncestor([JplBodyId.Earth], [JplBodyId.Earth])).toEqual(JplBodyId.Earth);
    expect(StateSolver2.prototype.findCommonAncestor([JplBodyId.SolarSystemBarycenter], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter])).toEqual(JplBodyId.SolarSystemBarycenter);
    expect(StateSolver2.prototype.findCommonAncestor([JplBodyId.SolarSystemBarycenter, JplBodyId.VenusBarycenter, JplBodyId.Venus], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter])).toEqual(JplBodyId.SolarSystemBarycenter);
    expect(StateSolver2.prototype.findCommonAncestor([JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter, JplBodyId.Moon], [JplBodyId.SolarSystemBarycenter, JplBodyId.EarthMoonBarycenter, JplBodyId.Earth])).toEqual(JplBodyId.EarthMoonBarycenter);
  });

});
