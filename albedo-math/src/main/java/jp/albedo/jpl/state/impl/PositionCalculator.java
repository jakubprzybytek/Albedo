package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.ChebyshevRecord;

import java.util.List;

public class PositionCalculator {

    final List<ChebyshevRecord> chebyshevRecords;

    private ChebyshevRecord cachedChebyshevRecord;

    public PositionCalculator(List<ChebyshevRecord> chebyshevRecords) {
        this.chebyshevRecords = chebyshevRecords;
    }

    public RectangularCoordinates compute(double jde) throws JplException {

        if (cachedChebyshevRecord == null || !cachedChebyshevRecord.getTimeSpan().inside(jde)) {
            cachedChebyshevRecord = chebyshevRecords.stream()
                    .filter(record -> record.getTimeSpan().inside(jde))
                    .reduce((a, b) -> b) // find last
                    .orElseThrow(() -> new JplException(String.format("Couldn't find coefficients for T=%f", jde)));
        }

        final double normalizedTime = cachedChebyshevRecord.getTimeSpan().normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(cachedChebyshevRecord.getCoefficients().x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedChebyshevRecord.getCoefficients().y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedChebyshevRecord.getCoefficients().z).computeFor(normalizedTime)
        );
    }

}
