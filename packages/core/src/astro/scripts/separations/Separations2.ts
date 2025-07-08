import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2, CorrectionType2 } from "@jpl/state";
import { timeProperties } from "@astro/scripts/utils/time";
import { SeparationWithPositions, Separation2 } from '.';

export class Separations2 {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  static buildSeparationFunction(stateSolver: StateSolver2, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): number => Radians.between(
      stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType2.NONE),
      stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType2.NONE)
    );
  }

  static buildPositionsAndSeparationFunction(stateSolver: StateSolver2, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): SeparationWithPositions => {
      const firstBodyPosition = stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType2.NONE);
      const secondBodyPosition = stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType2.NONE);
      return {
        es,
        firstBodyPosition,
        secondBodyPosition,
        separation: Radians.between(
          stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType2.NONE),
          stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType2.NONE)
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
