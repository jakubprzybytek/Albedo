package jp.albedo.common;

import org.apache.commons.math3.util.MathUtils;

public class Orbit {

    /**
     * GM for Sun [AU^3/day^2].
     */
    final static double GM_SUN = 0.000295912208285591095; // From de438

    /**
     * Computes orbital period for a body orbiting Sun. Mass of the orbiting body is neglected here meaning that computed year is a Gaussian Year.
     *
     * @param semiMajorAxis Semi major axis of the body in AU.
     * @return Orbital period in Solar days.
     */
    public static double getOrbitalPeriod(double semiMajorAxis) {
        return MathUtils.TWO_PI * Math.sqrt(Math.pow(semiMajorAxis, 3.0) / GM_SUN);
    }

}
