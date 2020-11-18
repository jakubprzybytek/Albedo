package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.KernelRepository;
import jp.albedo.jpl.kernel.SpkRecord;
import jp.albedo.jpl.state.impl.PositionCalculator2;

public class StateSolver {

    private final KernelRepository kernel;

    private final JplBody targetBody;

    private final JplBody observerBody;

    private final PositionCalculator2 positionCalculator;

    public StateSolver(KernelRepository kernel, JplBody targetBody, JplBody observerBody) throws JplException {
        this.kernel = kernel;
        this.targetBody = targetBody;
        this.observerBody = observerBody;

        SpkRecord chebyshevData = kernel.getChebyshevDataFor(targetBody, observerBody);
        this.positionCalculator = new PositionCalculator2(chebyshevData.getChebyshevRecords());
    }

    public RectangularCoordinates forDate(double jde) throws JplException {
        return positionCalculator.compute(jde);
    }

}
