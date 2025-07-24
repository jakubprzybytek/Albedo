import { Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { timeProperties } from "@astro/scripts/utils/time";
import { Separation } from '.';

export class Separations {

  readonly stateSolver: StateSolver;

  constructor(stateSolver: StateSolver) {
    this.stateSolver = stateSolver;
  }

  static buildSeparationFunction(stateSolver: StateSolver, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): number => Radians.between(
      stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION),
      stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION)
    );
  }

  // static buildPositionsAndSeparationFunction(stateSolver: StateSolver, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
  //   return (es: number): SeparationWithPositions => {
  //     const firstBodyPosition = stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType.NONE);
  //     const secondBodyPosition = stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType.NONE);
  //     return {
  //       es,
  //       firstBodyPosition,
  //       secondBodyPosition,
  //       separation: Radians.between(
  //         stateSolver.positionFor(firstBodyId, JplBodyId.Earth, es, CorrectionType.NONE),
  //         stateSolver.positionFor(secondBodyId, JplBodyId.Earth, es, CorrectionType.NONE)
  //       )
  //     }
  //   }
  // }

  for(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number): Separation[] {
    const separationFunction = Separations.buildSeparationFunction(this.stateSolver, targetBodyId, observerBodyId);
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return EphemerisSeconds.forRange(fromEs, toEs, itnervalEs)
      .map<Separation>(es => ({
        ...timeProperties(es),
        separation: separationFunction(es)
      }));
  }
};
