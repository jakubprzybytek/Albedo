import { describe, it, expect } from "vitest";
import { JplBodyId } from "@jpl";
import { kernelRepository } from '@jpl/data/de440.testData';

describe("StateSolver", () => {

  const stateSolver = kernelRepository.StateSolver();

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
