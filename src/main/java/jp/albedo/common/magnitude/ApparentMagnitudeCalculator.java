package jp.albedo.common.magnitude;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;

public interface ApparentMagnitudeCalculator {

    double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords);

}
