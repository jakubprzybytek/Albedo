import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2 } from "@jpl/state/solver2";
import { SeparationWithPositions, Separation2 } from '.';
import { JulianDay } from "@astro/JulianDay";
import { timeProperties } from "../utils/time";

export class Separations2 {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  static buildSeparationFunction(stateSolver: StateSolver2, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): number => Radians.between(
      stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es),
      stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es)
    );
  }

  static buildPositionsAndSeparationFunction(stateSolver: StateSolver2, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): SeparationWithPositions => {
      const firstBodyPosition = stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es);
      const secondBodyPosition = stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es);
      return {
        es,
        firstBodyPosition,
        secondBodyPosition,
        separation: Radians.between(
          stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es),
          stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es)
        )
      }
    }
  }

  for(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Separation2[] {
    const separationFunction = Separations2.buildSeparationFunction(this.stateSolver, targetBodyId, observerBodyId);
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map<Separation2>(es => ({
        ...timeProperties(es),
        separation: separationFunction(es)
      }));
  }
};
