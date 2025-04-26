import { Radians, RectangularCoordinates } from "../../../math";
import { SpkKernelCollection } from "../../kernel";
import { DirectStateSolver, StateSolver } from ".";
import { SPEED_OF_LIGHT } from "../..";

/**
 * Reference:
 * https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/abcorr.html
 * https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/spkezr_c.html
 */
export class StarAberrationCorrectingStateSolver implements StateSolver {

    readonly targetStateSolver: StateSolver;

    readonly observerStateSolver: DirectStateSolver;

    constructor(targetStateSolver: StateSolver, spkKernelRecordsForObserver: SpkKernelCollection[]) {
        this.targetStateSolver = targetStateSolver;
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const targetCoords = this.targetStateSolver.positionFor(ephemerisSeconds);
        const observerVelocity = this.observerStateSolver.velocityFor(ephemerisSeconds);

        const angle = Radians.between(observerVelocity, targetCoords);
        const aberrationAngle = Math.asin(observerVelocity.length() * Math.sin(angle) / SPEED_OF_LIGHT);

        const rotationVector = targetCoords.crossProduct(observerVelocity);

        return targetCoords.rotate(rotationVector, aberrationAngle);
    }

    velocityFor(ephemerisSeconds: number): RectangularCoordinates {
        throw Error("Velocity solving routine not implemented yet!");
    }

}
