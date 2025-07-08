import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2, CorrectionType2 } from "@jpl/state";
import { RectangularCoordinates } from "@math";
import { PositionInTime, StateInTime } from ".";

export class States {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  static buildPositionFunction(stateSolver: StateSolver2, bodyId: JplBodyId) {
    return (es: number) => stateSolver.positionFor(bodyId, JplBodyId.Earth, es, CorrectionType2.NONE);
  }

  position(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, correction: CorrectionType2): RectangularCoordinates {
    return this.stateSolver.positionFor(targetBodyId, observerBodyId, es, correction);
  }

  positions(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType2): PositionInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<PositionInTime>(es => ({
        es,
        coords: this.stateSolver.positionFor(targetBodyId, observerBodyId, es, correction)
      }));
  }

  states(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number, correction: CorrectionType2): StateInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<StateInTime>(es => ({
        es,
        ...this.stateSolver.stateFor(targetBodyId, observerBodyId, es, correction)
      }));
  }
}
