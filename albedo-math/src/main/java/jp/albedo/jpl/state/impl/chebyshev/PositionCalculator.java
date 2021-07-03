package jp.albedo.jpl.state.impl.chebyshev;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.state.impl.chebyshev.ChebyshevPolynomialExpander;

import java.util.List;

public class PositionCalculator {

    // FixMe: public just for tests
    public final List<PositionChebyshevRecord> positionChebyshevRecords;

    private PositionChebyshevRecord cachedPositionChebyshevRecord;

    public PositionCalculator(List<PositionChebyshevRecord> positionChebyshevRecords) {
        this.positionChebyshevRecords = positionChebyshevRecords;
    }

    public RectangularCoordinates compute(double jde) throws JplException {

        if (cachedPositionChebyshevRecord == null || !cachedPositionChebyshevRecord.getTimeSpan().inside(jde)) {
            cachedPositionChebyshevRecord = positionChebyshevRecords.stream()
                    .filter(record -> record.getTimeSpan().inside(jde))
                    .reduce((a, b) -> b) // FixMe: 'find last' requires traversing through entire collection
                    .orElseThrow(() -> new JplException(String.format("Couldn't find coefficients for T=%f", jde)));
        }

        final double normalizedTime = cachedPositionChebyshevRecord.getTimeSpan().normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().z).computeFor(normalizedTime)
        );
    }

}
