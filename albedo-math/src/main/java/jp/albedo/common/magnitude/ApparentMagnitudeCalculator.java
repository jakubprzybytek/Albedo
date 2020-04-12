package jp.albedo.common.magnitude;

import jp.albedo.common.RectangularCoordinates;

public interface ApparentMagnitudeCalculator {

    double compute(RectangularCoordinates heliocentricCoords, RectangularCoordinates geocentricCoords);

}
