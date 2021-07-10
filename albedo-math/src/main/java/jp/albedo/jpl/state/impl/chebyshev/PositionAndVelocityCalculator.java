package jp.albedo.jpl.state.impl.chebyshev;

import jp.albedo.common.RectangularCoordinates;
import jp.albedo.jpl.JplException;

public interface PositionAndVelocityCalculator {

    RectangularCoordinates positionFor(double ephemerisSeconds) throws JplException;

    RectangularCoordinates velocityFor(double ephemerisSeconds) throws JplException;

}
