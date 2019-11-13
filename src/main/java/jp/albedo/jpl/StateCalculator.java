package jp.albedo.jpl;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.impl.PositionCalculator;

/**
 * JPL's Kernel based states calculator for main Solar System objects.
 */
public class StateCalculator {

    final private SPKernel spKernel;

    final double au;

    final double earthMoonMassRatio;

    public StateCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
        this.au = this.spKernel.getConstant(Constant.AU);
        this.earthMoonMassRatio = this.spKernel.getConstant(Constant.EarthMoonMassRatio);
    }

    /**
     * Computes state for single time instant.
     *
     * @param body
     * @param jde
     * @return
     * @throws JplException
     */
    public RectangularCoordinates computeForJd(JplBody body, double jde) throws JplException {
        final PositionCalculator positionCalculator = this.spKernel.getPositionCalculatorFor(body);
        final Double au = this.spKernel.getConstant(Constant.AU);

        final RectangularCoordinates coordinates = positionCalculator.compute(jde);
        return coordinates.divideBy(au);
    }

}
