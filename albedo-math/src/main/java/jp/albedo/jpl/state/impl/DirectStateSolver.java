package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.files.util.EphemerisSeconds;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndTrueVelocityCalculator;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndVelocityCalculator;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndVelocitySolvingCalculator;
import jp.albedo.utils.FunctionUtils;

import java.util.List;
import java.util.stream.Collectors;

public class DirectStateSolver implements StateSolver {

    private static final double SECONDS_IN_DAY = 24.0 * 60.0 * 60.0;

    private static final double DERIVATIVE_STEP_SIZE = 20.0 / 24.0 / 60.0; // 20 minutes

    final List<PositionAndVelocityCalculator> calculators;

    final boolean negate;

    public DirectStateSolver(List<SpkKernelCollection> spkKernelCollections, boolean negate) {
        this.calculators = spkKernelCollections.stream()
                .map(this::buildCalculator)
                .collect(Collectors.toList());
        this.negate = negate;
    }

    private PositionAndVelocityCalculator buildCalculator(SpkKernelCollection spkKernelCollection) {
        return spkKernelCollection.hasPositionAndVelocityData() ?
                new PositionAndTrueVelocityCalculator(spkKernelCollection.getPositionAndVelocityData()) :
                new PositionAndVelocitySolvingCalculator(spkKernelCollection.getPositionData());
    }

    public RectangularCoordinates positionForDate(double jde) {
        final RectangularCoordinates computed = calculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.positionFor(EphemerisSeconds.fromJde(jde))))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
        return negate ? computed.negate() : computed;
    }

    @Override
    public RectangularCoordinates velocityForDate(double jde) {
        final RectangularCoordinates computed = calculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.velocityFor(EphemerisSeconds.fromJde(jde))))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
        return negate ? computed.negate() : computed;
    }

//    @Override
//    public RectangularCoordinates velocityForDate(double jde) {
//        RectangularCoordinates coordsMinusStep = positionForDate(jde - DERIVATIVE_STEP_SIZE);
//        RectangularCoordinates coordsPlusStep = positionForDate(jde + DERIVATIVE_STEP_SIZE);
//
//        return new RectangularCoordinates(
//                (coordsPlusStep.x - coordsMinusStep.x) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY,
//                (coordsPlusStep.y - coordsMinusStep.y) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY,
//                (coordsPlusStep.z - coordsMinusStep.z) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY);
//    }

}
