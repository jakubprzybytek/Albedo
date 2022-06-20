import { RectangularCoordinates } from '../../..';
import { PositionChebyshevRecord } from '@jpl/kernel';
import { ChebyshevPolynomialExpander } from './';

export class PositionCalculator {

    readonly positionChebyshevRecords: PositionChebyshevRecord[];

    cachedPositionChebyshevRecord!: PositionChebyshevRecord;

    constructor(positionChebyshevRecords: PositionChebyshevRecord[]) {
        this.positionChebyshevRecords = positionChebyshevRecords;
    }

    public compute(ephemerisSeconds: number): RectangularCoordinates {

        if (this.cachedPositionChebyshevRecord === undefined || !this.cachedPositionChebyshevRecord.timeSpan.inside(ephemerisSeconds)) {
            const foundRecord = this.positionChebyshevRecords
                .find(record => record.timeSpan.inside(ephemerisSeconds));

            if (foundRecord === undefined) {
                throw new Error(`No position Chebyshev records found for jde=${ephemerisSeconds}`);
            }

            this.cachedPositionChebyshevRecord = foundRecord;
        }

        const normalizedTime: number = this.cachedPositionChebyshevRecord.timeSpan.normalizeFor(ephemerisSeconds);

        return new RectangularCoordinates(
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.x).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.y).computeFor(normalizedTime),
            new ChebyshevPolynomialExpander(this.cachedPositionChebyshevRecord.positionCoefficients.z).computeFor(normalizedTime)
        );
    }
}
