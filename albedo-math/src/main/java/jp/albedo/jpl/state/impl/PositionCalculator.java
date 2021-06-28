package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;

import java.util.List;

public class PositionCalculator {

    final List<PositionChebyshevRecord> positionChebyshevRecords;

    private PositionChebyshevRecord cachedPositionChebyshevRecord;

    public PositionCalculator(List<PositionChebyshevRecord> positionChebyshevRecords) {
        this.positionChebyshevRecords = positionChebyshevRecords;
    }

    public RectangularCoordinates compute(double jde) throws JplException {

        if (cachedPositionChebyshevRecord == null || !cachedPositionChebyshevRecord.getTimeSpan().inside(jde)) {
            cachedPositionChebyshevRecord = positionChebyshevRecords.stream()
                    .filter(record -> record.getTimeSpan().inside(jde))
                    .reduce((a, b) -> b) // find last
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
