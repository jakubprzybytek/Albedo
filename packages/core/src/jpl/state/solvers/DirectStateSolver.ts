import { RectangularCoordinates } from '../../../math';
import { SpkKernelCollection, PositionAndVelocityChebyshevRecord, DataType } from "../../kernel";
import { PositionAndVelocityCalculator, PositionAndTrueVelocityCalculator, PositionAndVelocitySolvingCalculator } from "../chebyshev";
import { StateSolver } from "./";

export class DirectStateSolver implements StateSolver {

    readonly calculators: PositionAndVelocityCalculator[];

    readonly negate: boolean;

    constructor(spkKernelCollections: SpkKernelCollection[], negate: boolean = false) {
        this.calculators = spkKernelCollections
            .map(this.buildCalculator);
        this.negate = negate;
    }

    buildCalculator(spkKernelCollection: SpkKernelCollection): PositionAndVelocityCalculator {
        switch (spkKernelCollection.dataType) {
            case DataType.ChebyshevPosition:
                return new PositionAndVelocitySolvingCalculator(spkKernelCollection.data);
            case DataType.ChebyshevPositionAndVelocity:
                return new PositionAndTrueVelocityCalculator(spkKernelCollection.data as PositionAndVelocityChebyshevRecord[]);
        }
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
