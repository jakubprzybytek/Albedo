import { EphemerisSeconds, JplBodyId } from "@jpl";
import { StateSolver2, CorrectionType2 } from "@jpl/state/solver2";
import { RectangularCoordinates } from "@math";
import { PositionInTime } from ".";

export class States {

  readonly stateSolver: StateSolver2;

  constructor(stateSolver: StateSolver2) {
    this.stateSolver = stateSolver;
  }

  static buildPositionFunction(stateSolver: StateSolver2, bodyId: JplBodyId) {
    return (es: number) => stateSolver.positionFor(bodyId, JplBodyId.Earth, es, CorrectionType2.NONE);
  }

  position(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number, correction: CorrectionType2 = CorrectionType2.NONE): RectangularCoordinates {
    return this.stateSolver.positionFor(targetBodyId, observerBodyId, es, correction);
  }

  positions(targetBodyId: JplBodyId, observerBodyId: JplBodyId, fromEs: number, toEs: number, intervalEs: number): PositionInTime[] {
    return EphemerisSeconds.forRange(fromEs, toEs, intervalEs)
      .map<PositionInTime>(es => ({
        es,
        coords: this.stateSolver.positionFor(targetBodyId, observerBodyId, es, CorrectionType2.NONE)
      }));
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  velocity(targetBodyId: JplBodyId, observerBodyId: JplBodyId, es: number): RectangularCoordinates {
    throw new Error('Velocity calculation not implemented yet!');
  }

}
