import { RectangularCoordinates } from '../../math';
import { SpkKernelCollection } from "../kernel";
import { StateSolver, DirectStateSolver } from ".";

export class CommonCenterBodyStateSolver implements StateSolver {
    readonly targetStateSolver: DirectStateSolver;
    readonly observerStateSolver: DirectStateSolver;

    constructor(spkKernelCollectionsForTarget: SpkKernelCollection[], spkKernelCollectionsForObserver: SpkKernelCollection[]) {
        this.targetStateSolver = new DirectStateSolver(spkKernelCollectionsForTarget);
        this.observerStateSolver = new DirectStateSolver(spkKernelCollectionsForObserver);
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        return this.targetStateSolver.positionFor(ephemerisSeconds).subtract(this.observerStateSolver.positionFor(ephemerisSeconds));
    }

    velocityFor(ephemerisSeconds: number): RectangularCoordinates {
        return this.targetStateSolver.velocityFor(ephemerisSeconds).subtract(this.observerStateSolver.velocityFor(ephemerisSeconds));
//        throw Error('Velocity solving routine not implemented yet!');
    }
}
