package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

public class CommonCenterBodyStateSolver implements StateSolver {

    final DirectStateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public CommonCenterBodyStateSolver(List<SpkKernelCollection> spkKernelRecordsForTarget, List<SpkKernelCollection> spkKernelRecordsForObserver) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates positionForDate(double jde) {
        return targetStateSolver.positionForDate(jde).subtract(observerStateSolver.positionForDate(jde));
    }

    @Override
    public RectangularCoordinates velocityForDate(double jde) {
        throw new NotImplementedException("Velocity solving routine not implemented yet!");
    }

}
