import { RectangularCoordinates } from '../../../math';
import { ForwardLookingArray } from '../../utils';
import { PositionAndVelocityChebyshevRecord } from '../../kernel';
import { PositionAndVelocityCalculator, ChebyshevPolynomialExpander } from '.';

export class PositionAndTrueVelocityCalculator implements PositionAndVelocityCalculator {

    readonly positionAndVelocityChebyshevRecords: ForwardLookingArray<PositionAndVelocityChebyshevRecord>;

    constructor(positionAndVelocityChebyshevRecords: PositionAndVelocityChebyshevRecord[]) {
        this.positionAndVelocityChebyshevRecords = new ForwardLookingArray(positionAndVelocityChebyshevRecords);
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const record = this.positionAndVelocityChebyshevRecords.find(record => record.timeSpan.inside(ephemerisSeconds));

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
        const record = this.positionAndVelocityChebyshevRecords.find(record => record.timeSpan.inside(ephemerisSeconds));

        if (record === undefined) {
            throw new Error(`No position Chebyshev records found for jde=${ephemerisSeconds}`);
        }

        const normalizedTime = record.timeSpan.normalizeFor(ephemerisSeconds);

        return new RectangularCoordinates(
            new ChebyshevPolynomialExpander(record.velocityCoefficients.x).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(record.velocityCoefficients.y).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(record.velocityCoefficients.z).computeFor(normalizedTime)
        );
    }

}
