package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;

public interface StateSolver {

    /**
     * Computes X, Y, Z position coordinates for given time provided as Ephemeris Seconds.
     * @param ephemerisSeconds Time in Ephemeris Seconds.
     * @return Rectangular coordinates for position.
     */
    RectangularCoordinates positionFor(double ephemerisSeconds);

    /**
     * Computes velocity as X, Y, Z coordinates for given time provided as Ephemeris Seconds.
     * @param ephemerisSeconds Time in Ephemeris Seconds.
     * @return Rectangular coordinates for velocity.
     */
    RectangularCoordinates velocityFor(double ephemerisSeconds);

}
