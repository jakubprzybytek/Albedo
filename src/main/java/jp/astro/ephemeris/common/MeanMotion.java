package jp.astro.ephemeris.common;

public class MeanMotion {

    static public double fromSemiMajorAxis(double semiMajorAxis) {
        return Math.toRadians(0.9856076686 / (semiMajorAxis * Math.sqrt(semiMajorAxis)));
    }

}
