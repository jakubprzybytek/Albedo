import { RectangularCoordinates } from '../../../math';
import { SpkKernelCollection } from "../../kernel";
import { SPEED_OF_LIGHT } from '../..';
import { DirectStateSolver, StateSolver } from "./";

export class LightTimeCorrectingStateSolver implements StateSolver {

    readonly targetStateSolver: DirectStateSolver;

    readonly observerStateSolver: DirectStateSolver;

    constructor(spkKernelRecordsForTarget: SpkKernelCollection[], spkKernelRecordsForObserver: SpkKernelCollection[]) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const targetCoords = this.targetStateSolver.positionFor(ephemerisSeconds);
        const observerCoords = this.observerStateSolver.positionFor(ephemerisSeconds);

        const observerToTargetCoords = targetCoords.subtract(observerCoords);
        const lightTime = observerToTargetCoords.length() / SPEED_OF_LIGHT;

        const correctedJde = ephemerisSeconds - lightTime;
        const correctedTargetCoords = this.targetStateSolver.positionFor(correctedJde);

        return correctedTargetCoords.subtract(observerCoords);
    }

    velocityFor(ephemerisSeconds: number): RectangularCoordinates {
        throw Error("Velocity solving routine not implemented yet!");
    }

}
