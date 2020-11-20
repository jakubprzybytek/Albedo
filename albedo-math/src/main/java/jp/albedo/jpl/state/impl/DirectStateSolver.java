package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.utils.FunctionUtils;

import java.util.List;
import java.util.stream.Collectors;

public class DirectStateSolver implements StateSolver {

    final List<PositionCalculator> positionCalculators;

    final boolean negate;

    public DirectStateSolver(List<SpkKernelRecord> spkKernelRecords, boolean negate) {
        this.positionCalculators = spkKernelRecords.stream()
                .map(record -> new PositionCalculator(record.getChebyshevRecords()))
                .collect(Collectors.toList());
        this.negate = negate;
    }

    public RectangularCoordinates forDate(double jde) {
        final RectangularCoordinates computed = positionCalculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.compute(jde)))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
        return negate ? computed.negate() : computed;
    }

}
