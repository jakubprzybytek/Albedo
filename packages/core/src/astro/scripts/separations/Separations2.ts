import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2 } from "@jpl/state/solver2";
import { SimpleSeparation } from '.';

export class Separations2 {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  static buildSeparationFunction(stateSolver: StateSolver2, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number) => Radians.between(
      stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es),
      stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es)
    );
  }

  for(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, interval: number): SimpleSeparation[] {
    const separationFunction = Separations2.buildSeparationFunction(this.stateSolver, targetBodyId, observerBodyId);
    return EphemerisSeconds.forRange(fromEs, toEs, interval)
      .map<SimpleSeparation>(es => ({
        jde: EphemerisSeconds.toJde(es),
        separation: separationFunction(es)
      }));
  }
};
