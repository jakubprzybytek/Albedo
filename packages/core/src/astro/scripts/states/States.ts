import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { ObserverLocation, RectangularCoordinates } from "@astro/coords";
import { PositionInTime, StateInTime } from ".";
import { KernelsRepository } from "@jpl/kernels";
import { ParalaxCorrection } from "../paralaxCorrection/ParalaxCorrection";

export class States {

  readonly stateSolver: StateSolver;

  constructor(readonly kernels: KernelsRepository) {
    this.stateSolver = kernels.stateSolver();
  }

  buildPositionFunction(targetBodyId: JplBodyId, observerBodyId: JplBodyId = JplBodyId.Earth, correctionType: CorrectionType = CorrectionType.NONE) {
    return (es: number) => this.stateSolver.position(targetBodyId, observerBodyId, es, correctionType).coords;
  }

  buildParalaxCorrectedPositionFunction(targetBodyId: JplBodyId, observerBodyId: JplBodyId, observerLocation: ObserverLocation, correctionType: CorrectionType) {
    const paralaxCorrection = new ParalaxCorrection(this.kernels);
    return (es: number) => {
      const uncorrectedPosition = this.stateSolver.position(targetBodyId, observerBodyId, es, correctionType).coords;
      const observerCoordinates = paralaxCorrection.observerPosition(JplBodyId.Earth, observerLocation, es);
      return uncorrectedPosition.subtract(observerCoordinates);
    }
  }

  computePosition(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, correction: CorrectionType): RectangularCoordinates {
    return this.stateSolver.position(targetBodyId, observerBodyId, es, correction).coords;
  }

  computePositions(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType): PositionInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<PositionInTime>(es => ({
        es,
        coords: this.stateSolver.position(targetBodyId, observerBodyId, es, correction).coords
      }));
  }

  computeState(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, correction: CorrectionType): StateInTime {
    return {
      es,
      ...this.stateSolver.state(targetBodyId, observerBodyId, es, correction)
    };
  }

  computeStates(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType): StateInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<StateInTime>(es => ({
        es,
        ...this.stateSolver.state(targetBodyId, observerBodyId, es, correction)
      }));
  }
}
