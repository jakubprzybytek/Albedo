package jp.albedo.jpl.state.impl;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

public class LightTimeCorrectingStateSolver implements StateSolver {

    final DirectStateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public LightTimeCorrectingStateSolver(List<SpkKernelCollection> spkKernelRecordsForTarget, List<SpkKernelCollection> spkKernelRecordsForObserver) {
        this.targetStateSolver = new DirectStateSolver(spkKernelRecordsForTarget, false);
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates positionFor(double ephemerisSeconds) {
        final RectangularCoordinates targetCoords = targetStateSolver.positionFor(ephemerisSeconds);
        final RectangularCoordinates observerCoords = observerStateSolver.positionFor(ephemerisSeconds);

        final RectangularCoordinates observerToTargetCoords = targetCoords.subtract(observerCoords);
        final double lightTime = observerToTargetCoords.getDistance() / JplConstant.SPEED_OF_LIGHT;

        final double correctedJde = ephemerisSeconds - lightTime;
        final RectangularCoordinates correctedTargetCoords = targetStateSolver.positionFor(correctedJde);

        return correctedTargetCoords.subtract(observerCoords);
    }

    @Override
    public RectangularCoordinates velocityFor(double ephemerisSeconds) {
        throw new NotImplementedException("Velocity solving routine not implemented yet!");
    }

}
