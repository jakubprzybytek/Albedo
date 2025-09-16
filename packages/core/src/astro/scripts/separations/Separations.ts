import { ObserverLocation, Radians } from "@astro/coords";
import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { timeProperties } from "@astro/scripts/utils/time";
import { Separation } from '.';
import { KernelsRepository } from "@jpl/kernels";
import { ParalaxCorrection } from "../paralaxCorrection/ParalaxCorrection";

export class Separations {

  readonly stateSolver: StateSolver;

  readonly paralaxCorrection: ParalaxCorrection;

  constructor(kernels: KernelsRepository) {
    this.stateSolver = kernels.stateSolver();
    this.paralaxCorrection = new ParalaxCorrection(kernels);
  }

  static buildSeparationFunction(stateSolver: StateSolver, firstBodyId: JplBodyId, secondBodyId: JplBodyId) {
    return (es: number): number => Radians.between(
      stateSolver.position(firstBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords,
      stateSolver.position(secondBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords
    );
  }

  static buildSeparationFunctionWithParalaxCorrection(stateSolver: StateSolver, paralaxCorrection: ParalaxCorrection, firstBodyId: JplBodyId, secondBodyId: JplBodyId, observerLocation: ObserverLocation) {
    return (es: number): number => {
      const firstBodyPosition = stateSolver.position(firstBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;
      const secondBodyPosition = stateSolver.position(secondBodyId, JplBodyId.Earth, es, CorrectionType.LIGHT_TIME_AND_STAR_ABBERATION).coords;

      const observerCoordinates = paralaxCorrection.observerPosition(observerLocation, es);
      const firstBodyObserverPosition = firstBodyPosition.subtract(observerCoordinates);
      const secondBodyObserverPosition = secondBodyPosition.subtract(observerCoordinates);

      return Radians.between(firstBodyObserverPosition, secondBodyObserverPosition);
    }
  }

  private computeSeparations(separationFunction: (es: number) => number, fromEs: number, toEs: number, intervalEs: number): Separation[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<Separation>(es => ({
        ...timeProperties(es),
        separation: separationFunction(es)
      }));
  }

  for(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromJde: number, toJde: number, interval: number, observerLocation?: ObserverLocation): Separation[] {
    const separationFunction = observerLocation
      ? Separations.buildSeparationFunctionWithParalaxCorrection(this.stateSolver, this.paralaxCorrection, targetBodyId, observerBodyId, observerLocation)
      : Separations.buildSeparationFunction(this.stateSolver, targetBodyId, observerBodyId);
    const fromEs = EphemerisSeconds.fromJde(fromJde);
    const toEs = EphemerisSeconds.fromJde(toJde);
    const itnervalEs = EphemerisSeconds.fromDays(interval);
    return this.computeSeparations(separationFunction, fromEs, toEs, itnervalEs);
  }

};
