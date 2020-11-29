package jp.albedo.jpl.state.impl;

import jp.albedo.common.Radians;
import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplConstant;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.StateSolver;

import java.util.List;

public class StarAberrationCorrectingStateSolver implements StateSolver {

    private static final double SECONDS_IN_DAY = 24.0 * 60.0 * 60.0;

    private static final double DERIVATIVE_STEP_SIZE = 20.0 / 24.0 / 60.0; // 20 minutes

    final StateSolver targetStateSolver;

    final DirectStateSolver observerStateSolver;

    public StarAberrationCorrectingStateSolver(StateSolver targetObjectSolver, List<SpkKernelRecord> spkKernelRecordsForObserver) {
        this.targetStateSolver = targetObjectSolver;
        this.observerStateSolver = new DirectStateSolver(spkKernelRecordsForObserver, false);
    }

    @Override
    public RectangularCoordinates forDate(double jde) {
        final RectangularCoordinates targetCoords = targetStateSolver.forDate(jde);

        final RectangularCoordinates observerVelocity = solveForVelocity(observerStateSolver, jde);

        final double angle = Radians.between(observerVelocity, targetCoords);
        final double aberrationAngle = Math.asin(observerVelocity.getDistance() * Math.sin(angle) / JplConstant.SPEED_OF_LIGHT);

        final RectangularCoordinates rotationVector = targetCoords.crossProduct(observerVelocity);

        return targetCoords.rotate(rotationVector, aberrationAngle);
    }

    private RectangularCoordinates solveForVelocity(StateSolver stateSolver, double jde) {
        RectangularCoordinates coordsMinusStep = stateSolver.forDate(jde - DERIVATIVE_STEP_SIZE);
        RectangularCoordinates coordsPlusStep = stateSolver.forDate(jde + DERIVATIVE_STEP_SIZE);

        return new RectangularCoordinates(
                (coordsPlusStep.x - coordsMinusStep.x) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY,
                (coordsPlusStep.y - coordsMinusStep.y) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY,
                (coordsPlusStep.z - coordsMinusStep.z) / (2 * DERIVATIVE_STEP_SIZE) / SECONDS_IN_DAY);
    }

}
