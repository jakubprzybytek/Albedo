package jp.albedo.jpl.ephemeris;

import jp.albedo.jeanmeeus.ephemeris.common.RectangularCoordinates;

public interface ApparentMagnitudeCalculator {

    double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords);

}
