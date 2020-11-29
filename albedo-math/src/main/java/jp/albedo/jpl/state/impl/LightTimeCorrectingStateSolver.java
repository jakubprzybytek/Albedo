package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;

import java.util.List;

public class LightTimeCorrectingStateSolver implements StateSolver {

    private static final double SECONDS_IN_DAY = 24.0 * 60.0 * 60.0;

    final DirectStateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public LightTimeCorrectingStateSolver(List<SpkKernelRecord> spkKernelRecordsForTarget, List<SpkKernelRecord> spkKernelRecordsForObserver) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates forDate(double jde) {
        final RectangularCoordinates targetCoords = targetStateSolver.forDate(jde);
        final RectangularCoordinates observerCoords = observerStateSolver.forDate(jde);

        final RectangularCoordinates observerToTargetCoords = targetCoords.subtract(observerCoords);

        final double lightTime = observerToTargetCoords.getDistance() / JplConstant.SPEED_OF_LIGHT;
        final double correctedJde = jde - lightTime / SECONDS_IN_DAY;

        final RectangularCoordinates correctedTargetCoords = targetStateSolver.forDate(correctedJde);

        return correctedTargetCoords.subtract(observerCoords);
    }

}
