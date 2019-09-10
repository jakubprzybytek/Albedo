package jp.albedo.ephemeris.common;

public class MeanMotion {

    /**
     *
     * @param semiMajorAxis
     * @return Mean daily motion in degrees.
     */
    static public double fromSemiMajorAxis(double semiMajorAxis) {
        return 0.9856076686 / (semiMajorAxis * Math.sqrt(semiMajorAxis));
    }

}
