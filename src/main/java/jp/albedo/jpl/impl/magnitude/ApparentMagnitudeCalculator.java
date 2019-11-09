package jp.albedo.jpl.impl.magnitude;

import jp.albedo.ephemeris.common.RectangularCoordinates;

public interface ApparentMagnitudeCalculator {

    double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords);

}
