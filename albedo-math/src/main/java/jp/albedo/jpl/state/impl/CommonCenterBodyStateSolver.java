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
    public RectangularCoordinates positionFor(double ephemerisSeconds) {
        return targetStateSolver.positionFor(ephemerisSeconds).subtract(observerStateSolver.positionFor(ephemerisSeconds));
    }

    @Override
    public RectangularCoordinates velocityFor(double ephemerisSeconds) {
        throw new NotImplementedException("Velocity solving routine not implemented yet!");
    }

}
