import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver, CorrectionType } from "@jpl/state";
import { RectangularCoordinates } from "@astro/coords";
import { PositionInTime, StateInTime } from ".";
import { KernelsRepository } from "@jpl/kernels";

export class States {

  readonly stateSolver: StateSolver;

  constructor(kernels: KernelsRepository) {
    this.stateSolver = kernels.stateSolver();
  }

  static buildPositionFunction(stateSolver: StateSolver, bodyId: JplBodyId) {
    return (es: number) => stateSolver.position(bodyId, JplBodyId.Earth, es, CorrectionType.NONE).coords;
  }

  position(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, correction: CorrectionType): RectangularCoordinates {
    return this.stateSolver.position(targetBodyId, observerBodyId, es, correction).coords;
  }

  positions(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType): PositionInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<PositionInTime>(es => ({
        es,
        coords: this.stateSolver.position(targetBodyId, observerBodyId, es, correction).coords
      }));
  }

  states(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType): StateInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<StateInTime>(es => ({
        es,
        ...this.stateSolver.state(targetBodyId, observerBodyId, es, correction)
      }));
  }
}
