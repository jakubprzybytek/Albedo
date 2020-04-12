package jp.albedo.common.ephemeris;

import jp.albedo.common.AstronomicalCoordinates;
import jp.albedo.common.Radians;
import org.apache.commons.math3.util.MathUtils;

public class Elongation {

    public static double between(AstronomicalCoordinates first, AstronomicalCoordinates second) {
        final double direction = MathUtils.normalizeAngle(second.rightAscension - first.rightAscension, 0.0) >= 0.0 ? 1.0 : -1.0;
        return Radians.separation(first, second) * direction;
    }

}
