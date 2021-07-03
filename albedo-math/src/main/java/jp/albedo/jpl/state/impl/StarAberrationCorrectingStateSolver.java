package jp.albedo.jpl.state.impl;

import jp.albedo.common.Radians;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.state.StateSolver;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

/**
 * Reference:
 * https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/abcorr.html
 * https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/spkezr_c.html
 */
public class StarAberrationCorrectingStateSolver implements StateSolver {

    final StateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public StarAberrationCorrectingStateSolver(StateSolver targetObjectSolver, List<SpkKernelCollection> spkKernelRecordsForObserver) {
        this.targetStateSolver = targetObjectSolver;
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates positionForDate(double jde) {
        final RectangularCoordinates targetCoords = targetStateSolver.positionForDate(jde);
        final RectangularCoordinates observerVelocity = observerStateSolver.velocityForDate(jde);

        final double angle = Radians.between(observerVelocity, targetCoords);
        final double aberrationAngle = Math.asin(observerVelocity.getDistance() * Math.sin(angle) / JplConstant.SPEED_OF_LIGHT);

        final RectangularCoordinates rotationVector = targetCoords.crossProduct(observerVelocity);

        return targetCoords.rotate(rotationVector, aberrationAngle);
    }

    @Override
    public RectangularCoordinates velocityForDate(double jde) {
        throw new NotImplementedException("Velocity solving routine not implemented yet!");
    }

}
