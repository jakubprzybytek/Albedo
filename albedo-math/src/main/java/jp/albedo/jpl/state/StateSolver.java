package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.KernelRepository;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.state.impl.PositionCalculator;

public class StateSolver {

    private final KernelRepository kernel;

    private final JplBody targetBody;

    private final JplBody observerBody;

    private final PositionCalculator positionCalculator;

    public StateSolver(KernelRepository kernel, JplBody targetBody, JplBody observerBody) throws JplException {
        this.kernel = kernel;
        this.targetBody = targetBody;
        this.observerBody = observerBody;

        SpkKernelRecord chebyshevData = kernel.getChebyshevDataFor(targetBody, observerBody);
        this.positionCalculator = new PositionCalculator(chebyshevData.getChebyshevRecords());
    }

    public RectangularCoordinates forDate(double jde) throws JplException {
        return positionCalculator.compute(jde);
    }

}
