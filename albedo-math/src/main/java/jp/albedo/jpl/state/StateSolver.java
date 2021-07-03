package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;

public interface StateSolver {

    RectangularCoordinates positionForDate(double jde);

    RectangularCoordinates velocityForDate(double jde);

}
