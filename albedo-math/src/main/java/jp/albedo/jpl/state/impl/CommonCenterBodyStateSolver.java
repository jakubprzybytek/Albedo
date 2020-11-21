package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;

import java.util.List;

public class CommonCenterBodyStateSolver implements StateSolver {

    final DirectStateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public CommonCenterBodyStateSolver(List<SpkKernelRecord> spkKernelRecordsForTarget, List<SpkKernelRecord> spkKernelRecordsForObserver) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates forDate(double jde) {
        return targetStateSolver.forDate(jde).subtract(observerStateSolver.forDate(jde));
    }

}
