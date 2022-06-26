import { RectangularCoordinates } from '../..';
import { SpkKernelCollection } from "../kernel";
import { StateSolver, PositionAndVelocityCalculator, PositionAndVelocitySolvingCalculator } from "./";

export class DirectStateSolver implements StateSolver {

    readonly calculators: PositionAndVelocityCalculator[];

    readonly negate: boolean;

    constructor(spkKernelCollections: SpkKernelCollection[], negate: boolean = false) {
        this.calculators = spkKernelCollections
            .map(this.buildCalculator);
        this.negate = negate;
    }

    buildCalculator(spkKernelCollection: SpkKernelCollection): PositionAndVelocityCalculator {
        return new PositionAndVelocitySolvingCalculator(spkKernelCollection.positionData);
        // return spkKernelCollection.hasPositionAndVelocityData() ?
        //         new PositionAndTrueVelocityCalculator(spkKernelCollection.getPositionAndVelocityData()) :
        //         new PositionAndVelocitySolvingCalculator(spkKernelCollection.getPositionData());
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const computed = this.calculators
            .map(calculator => calculator.positionFor(ephemerisSeconds))
            .reduce((a, b) => a.add(b), RectangularCoordinates.ZERO);
        return this.negate ? computed.negate() : computed;
    }

    velocityFor(ephemerisSeconds: number): RectangularCoordinates {
        const computed = this.calculators
            .map(calculator => calculator.velocityFor(ephemerisSeconds))
            .reduce((a, b) => a.add(b), RectangularCoordinates.ZERO);
        return this.negate ? computed.negate() : computed;
    }

}
