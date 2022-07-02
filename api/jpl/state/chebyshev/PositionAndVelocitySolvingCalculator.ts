import { RectangularCoordinates } from '../../../math';
import { ForwardLookingArray } from '../../utils';
import { PositionChebyshevRecord } from '../../kernel';
import { PositionAndVelocityCalculator, ChebyshevPolynomialExpander } from './';

const DERIVATIVE_STEP_SIZE = 20.0; // seconds

export class PositionAndVelocitySolvingCalculator implements PositionAndVelocityCalculator {

    readonly positionChebyshevRecords: ForwardLookingArray<PositionChebyshevRecord>;

    constructor(positionChebyshevRecords: PositionChebyshevRecord[]) {
        this.positionChebyshevRecords = new ForwardLookingArray(positionChebyshevRecords);
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const record = this.positionChebyshevRecords.find(record => record.timeSpan.inside(ephemerisSeconds));

        if (record === undefined) {
            throw new Error(`No position Chebyshev records found for jde=${ephemerisSeconds}`);
        }

        const normalizedTime = record.timeSpan.normalizeFor(ephemerisSeconds);

        return new RectangularCoordinates(
            new ChebyshevPolynomialExpander(record.positionCoefficients.x).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(record.positionCoefficients.y).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(record.positionCoefficients.z).computeFor(normalizedTime)
        );
    }

    velocityFor(ephemerisSeconds: number): RectangularCoordinates {
        const coordsMinusStep = this.positionFor(ephemerisSeconds - DERIVATIVE_STEP_SIZE);
        const coordsPlusStep = this.positionFor(ephemerisSeconds + DERIVATIVE_STEP_SIZE);

        return new RectangularCoordinates(
            (coordsPlusStep.x - coordsMinusStep.x) / (2 * DERIVATIVE_STEP_SIZE),
            (coordsPlusStep.y - coordsMinusStep.y) / (2 * DERIVATIVE_STEP_SIZE),
            (coordsPlusStep.z - coordsMinusStep.z) / (2 * DERIVATIVE_STEP_SIZE)
        );
    }

}
