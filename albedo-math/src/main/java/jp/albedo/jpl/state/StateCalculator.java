package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.SPKernel;
import jp.albedo.jpl.state.impl.PositionCalculator;

/**
 * JPL's Kernel based states calculator for main Solar System objects.
 */
public class StateCalculator {

    final PositionCalculator positionCalculator;

    public StateCalculator(JplBody body, SPKernel spKernel) throws JplException {
        this.positionCalculator = spKernel.getPositionCalculatorFor(body);
    }

    /**
     * Computes state for single time instant.
     *
     * @param jde
     * @return
     * @throws JplException
     */
    public RectangularCoordinates compute(double jde) throws JplException {
        return positionCalculator.compute(jde);
    }

}
