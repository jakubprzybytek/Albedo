package jp.albedo.jpl.state.impl.chebyshev;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;

import java.util.List;

public class PositionAndVelocitySolvingCalculator implements PositionAndVelocityCalculator {

    private static final double DERIVATIVE_STEP_SIZE = 60.0 * 20.0; // 20 minutes

    // FixMe: public just for tests
    public final List<PositionChebyshevRecord> positionChebyshevRecords;

    private PositionChebyshevRecord cachedPositionChebyshevRecord;

    public PositionAndVelocitySolvingCalculator(List<PositionChebyshevRecord> positionChebyshevRecords) {
        this.positionChebyshevRecords = positionChebyshevRecords;
    }

    public RectangularCoordinates positionFor(double ephemerisSeconds) throws JplException {

        final PositionChebyshevRecord record = findPositionChebyshevRecord(ephemerisSeconds);
        final double normalizedTime = record.getTimeSpan().normalizeFor(ephemerisSeconds);

        return new RectangularCoordinates(
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().x).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().y).computeFor(normalizedTime),
                new ChebyshevPolynomialExpander(cachedPositionChebyshevRecord.getPositionCoefficients().z).computeFor(normalizedTime));
    }

    @Override
    public RectangularCoordinates velocityFor(double ephemerisSeconds) throws JplException {
        RectangularCoordinates coordsMinusStep = positionFor(ephemerisSeconds - DERIVATIVE_STEP_SIZE);
        RectangularCoordinates coordsPlusStep = positionFor(ephemerisSeconds + DERIVATIVE_STEP_SIZE);

        return new RectangularCoordinates(
                (coordsPlusStep.x - coordsMinusStep.x) / (2 * DERIVATIVE_STEP_SIZE),
                (coordsPlusStep.y - coordsMinusStep.y) / (2 * DERIVATIVE_STEP_SIZE),
                (coordsPlusStep.z - coordsMinusStep.z) / (2 * DERIVATIVE_STEP_SIZE));
    }

    private PositionChebyshevRecord findPositionChebyshevRecord(double jde) throws JplException {
        if (cachedPositionChebyshevRecord == null || !cachedPositionChebyshevRecord.getTimeSpan().inside(jde)) {
            cachedPositionChebyshevRecord = positionChebyshevRecords.stream()
                    .filter(record -> record.getTimeSpan().inside(jde))
                    .reduce((a, b) -> b) // FixMe: 'find last' requires traversing through entire collection
                    .orElseThrow(() -> new JplException(String.format("Couldn't find coefficients for T=%f", jde)));
        }
        return cachedPositionChebyshevRecord;
    }
}
