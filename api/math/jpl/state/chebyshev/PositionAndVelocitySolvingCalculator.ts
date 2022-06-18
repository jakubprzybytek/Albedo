import { RectangularCoordinates } from 'math';
import { PositionChebyshevRecord } from '@jpl/kernel';
import { PositionAndVelocityCalculator, ChebyshevPolynomialExpander } from '.';

const DERIVATIVE_STEP_SIZE = 20.0; // seconds

export class PositionAndVelocitySolvingCalculator implements PositionAndVelocityCalculator {

    readonly positionChebyshevRecords: PositionChebyshevRecord[];

    cachedPositionChebyshevRecord!: PositionChebyshevRecord;

    constructor(positionChebyshevRecords: PositionChebyshevRecord[]) {
        this.positionChebyshevRecords = positionChebyshevRecords;
    }

    positionFor(ephemerisSeconds: number): RectangularCoordinates {
        const record = this.findPositionChebyshevRecord(ephemerisSeconds);
        const normalizedTime = record.timeSpan.normalizeFor(ephemerisSeconds);

        return new RectangularCoordinates(
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.x).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.y).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.z).computeFor(normalizedTime)
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

    private findPositionChebyshevRecord(ephemerisSeconds: number): PositionChebyshevRecord {
        if (this.cachedPositionChebyshevRecord === undefined || !this.cachedPositionChebyshevRecord.timeSpan.inside(ephemerisSeconds)) {
            const foundRecord = this.positionChebyshevRecords
                .find(record => record.timeSpan.inside(ephemerisSeconds));

            if (foundRecord === undefined) {
                throw new Error(`No position Chebyshev records found for jde=${ephemerisSeconds}`);
            }

            this.cachedPositionChebyshevRecord = foundRecord;
        }
        return this.cachedPositionChebyshevRecord;
    }
}
