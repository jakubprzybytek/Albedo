package jp.albedo.jpl.state;

import jp.albedo.common.RectangularCoordinates;

public interface StateSolver {

    RectangularCoordinates forDate(double jde);

}
