package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.utils.FunctionUtils;

import java.util.List;
import java.util.stream.Collectors;

public class DirectStateSolver implements StateSolver {

    final List<PositionCalculator> positionCalculators;

    public DirectStateSolver(List<SpkKernelRecord> spkKernelRecords) {
        this.positionCalculators = spkKernelRecords.stream()
                .map(record -> new PositionCalculator(record.getChebyshevRecords()))
                .collect(Collectors.toList());
    }

    public RectangularCoordinates forDate(double jde) {
        return positionCalculators.stream()
                .map(FunctionUtils.wrap(calculator -> calculator.compute(jde)))
                .reduce(RectangularCoordinates.ZERO, RectangularCoordinates::add);
    }

}
