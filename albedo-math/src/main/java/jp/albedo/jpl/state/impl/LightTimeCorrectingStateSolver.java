package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

public class LightTimeCorrectingStateSolver implements StateSolver {

    private static final double SECONDS_IN_DAY = 24.0 * 60.0 * 60.0;

    final DirectStateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public LightTimeCorrectingStateSolver(List<SpkKernelCollection> spkKernelRecordsForTarget, List<SpkKernelCollection> spkKernelRecordsForObserver) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates positionForDate(double jde) {
        final RectangularCoordinates targetCoords = targetStateSolver.positionForDate(jde);
        final RectangularCoordinates observerCoords = observerStateSolver.positionForDate(jde);

        final RectangularCoordinates observerToTargetCoords = targetCoords.subtract(observerCoords);

        final double lightTime = observerToTargetCoords.getDistance() / JplConstant.SPEED_OF_LIGHT;
        final double correctedJde = jde - lightTime / SECONDS_IN_DAY;

        final RectangularCoordinates correctedTargetCoords = targetStateSolver.positionForDate(correctedJde);

        return correctedTargetCoords.subtract(observerCoords);
    }

    @Override
    public RectangularCoordinates velocityForDate(double jde) {
        throw new NotImplementedException("Velocity solving routine not implemented yet!");
    }

}
