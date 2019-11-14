package jp.albedo.jpl.state;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.impl.PositionCalculator;

/**
 * JPL's Kernel based states calculator for main Solar System objects.
 */
public class StateCalculator {

    final private SPKernel spKernel;

    StateCalculator(SPKernel spKernel) {
        this.spKernel = spKernel;
    }

    /**
     * Computes state for single time instant.
     *
     * @param body
     * @param jde
     * @return
     * @throws JplException
     */
    public RectangularCoordinates compute(JplBody body, double jde) throws JplException {
        final PositionCalculator positionCalculator = this.spKernel.getPositionCalculatorFor(body);
        return positionCalculator.compute(jde);
    }

}
