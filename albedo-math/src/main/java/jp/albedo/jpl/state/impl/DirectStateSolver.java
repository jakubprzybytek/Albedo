package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndTrueVelocityCalculator;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndVelocityCalculator;
import jp.albedo.jpl.state.impl.chebyshev.PositionAndVelocitySolvingCalculator;
import jp.albedo.utils.FunctionUtils;

import java.util.List;
import java.util.stream.Collectors;

public class DirectStateSolver implements StateSolver {

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

    public RectangularCoordinates positionFor(double ephemerisSeconds) {
        final RectangularCoordinates computed = calculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.positionFor(ephemerisSeconds)))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
        return negate ? computed.negate() : computed;
    }

    @Override
    public RectangularCoordinates velocityFor(double ephemerisSeconds) {
        final RectangularCoordinates computed = calculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.velocityFor(ephemerisSeconds)))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
        return negate ? computed.negate() : computed;
    }

}
