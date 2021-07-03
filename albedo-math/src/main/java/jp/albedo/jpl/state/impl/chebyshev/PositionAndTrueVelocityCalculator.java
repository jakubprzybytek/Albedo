package jp.albedo.jpl.state.impl.chebyshev;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;

import java.util.List;

public class PositionAndTrueVelocityCalculator implements PositionAndVelocityCalculator {

    // FixMe: public just for tests
    public final List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords;

    private PositionAndVelocityChebyshevRecord cachedPositionAndVelocityChebyshevRecord;

    public PositionAndTrueVelocityCalculator(List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords) {
        this.positionAndVelocityChebyshevRecords = positionAndVelocityChebyshevRecords;
    }

    public RectangularCoordinates positionFor(double jde) throws JplException {

        final PositionAndVelocityChebyshevRecord record = findPositionAndVelocityChebyshevRecord(jde);
        final double normalizedTime = record.getTimeSpan().normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(record.getPositionCoefficients().x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(record.getPositionCoefficients().y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(record.getPositionCoefficients().z).computeFor(normalizedTime)
        );
    }

    @Override
    public RectangularCoordinates velocityFor(double jde) throws JplException {

        final PositionAndVelocityChebyshevRecord record = findPositionAndVelocityChebyshevRecord(jde);
        final double normalizedTime = record.getTimeSpan().normalizeFor(jde);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(record.getVelocityCoefficients().x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(record.getVelocityCoefficients().y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(record.getVelocityCoefficients().z).computeFor(normalizedTime)
        );
    }

    private PositionAndVelocityChebyshevRecord findPositionAndVelocityChebyshevRecord(double jde) throws JplException {
        if (cachedPositionAndVelocityChebyshevRecord == null || !cachedPositionAndVelocityChebyshevRecord.getTimeSpan().inside(jde)) {
            cachedPositionAndVelocityChebyshevRecord = positionAndVelocityChebyshevRecords.stream()
                    .filter(record -> record.getTimeSpan().inside(jde))
                    .reduce((a, b) -> b) // FixMe: 'find last' requires traversing through entire collection
                    .orElseThrow(() -> new JplException(String.format("Couldn't find coefficients for T=%f", jde)));
        }
        return cachedPositionAndVelocityChebyshevRecord;
    }

}
